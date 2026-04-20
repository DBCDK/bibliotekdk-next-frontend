const http = require("node:http");
const net = require("node:net");

function toMs(startNs, endNs = process.hrtime.bigint()) {
  return Number(endNs - startNs) / 1e6;
}

function roundedDuration(startNs, endNs) {
  if (!startNs || !endNs) return undefined;
  return Number(toMs(startNs, endNs).toFixed(1));
}

function compactObject(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => typeof value !== "undefined"),
  );
}

function buildUpstreamTimings({
  startedAtNs,
  upstreamStartedAtNs,
  upstreamSocketAtNs,
  upstreamConnectedAtNs,
  upstreamResponseAtNs,
  finishedAtNs,
}) {
  return compactObject({
    totalMs: roundedDuration(startedAtNs, finishedAtNs),
    upstreamQueueMs: roundedDuration(upstreamStartedAtNs, upstreamSocketAtNs),
    upstreamConnectMs: roundedDuration(upstreamSocketAtNs, upstreamConnectedAtNs),
    upstreamTtfbMs: roundedDuration(upstreamStartedAtNs, upstreamResponseAtNs),
    upstreamResponseMs: roundedDuration(upstreamResponseAtNs, finishedAtNs),
    upstreamTotalMs: roundedDuration(upstreamStartedAtNs, finishedAtNs),
  });
}

function safeParseJson(rawBody) {
  try {
    return JSON.parse(rawBody);
  } catch {
    return {};
  }
}

function readJsonBody(req, { maxBytes }) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const chunks = [];
    let bodySize = 0;

    const settleReject = (statusCode, message) => {
      if (settled) return;
      settled = true;
      reject({ statusCode, message });
    };

    const settleResolve = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    req.on("data", (chunk) => {
      bodySize += chunk.length;
      if (bodySize > maxBytes) {
        req.destroy();
        settleReject(413, "Payload Too Large");
        return;
      }
      chunks.push(chunk);
    });

    req.on("error", () => {
      settleReject(400, "Bad Request");
    });

    req.on("end", () => {
      const rawBody = Buffer.concat(chunks).toString("utf8");
      settleResolve(safeParseJson(rawBody));
    });
  });
}

function attachRequestHelpers(req, { maxBodyBytes }) {
  let parsedBodyPromise;
  req.parseBody = () => {
    if (!parsedBodyPromise) {
      parsedBodyPromise = readJsonBody(req, { maxBytes: maxBodyBytes });
    }
    return parsedBodyPromise;
  };
}

function attachResponseHelpers(res) {
  let responded = false;
  const rawEnd = res.end.bind(res);

  res.send = (statusCode, body, headers = {}) => {
    if (responded) return false;
    responded = true;
    res.writeHead(statusCode, headers);
    rawEnd(body);
    return true;
  };

  res.endWith = (statusCode, body, headers = {}) => {
    return res.send(statusCode, body, headers);
  };

  res.sendJson = (statusCode, body) => {
    return res.send(statusCode, JSON.stringify(body), {
      "content-type": "application/json; charset=utf-8",
    });
  };
}

function proxyWebSocketUpgrade({ req, socket, head, socketPath }) {
  const upstreamSocket = net.connect({ path: socketPath }, () => {
    const headers = Object.entries(req.headers)
      .filter(([, value]) => value !== undefined)
      .map(
        ([name, value]) =>
          `${name}: ${Array.isArray(value) ? value.join(", ") : value}`,
      )
      .join("\r\n");

    upstreamSocket.write(
      `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n${headers}\r\n\r\n`,
    );

    if (head && head.length > 0) {
      upstreamSocket.write(head);
    }

    socket.pipe(upstreamSocket).pipe(socket);
  });

  upstreamSocket.on("error", () => !socket.destroyed && socket.destroy());
  socket.on("error", () => !upstreamSocket.destroyed && upstreamSocket.destroy());
}

function proxyToUpstream({
  req,
  res,
  socketPath,
  agent,
  timeoutMs,
  startedAtNs,
  onComplete,
}) {
  let settled = false;
  const timingPoints = {
    upstreamStartedAtNs: process.hrtime.bigint(),
  };

  const complete = (statusCode) => {
    const finishedAtNs = process.hrtime.bigint();
    onComplete?.({
      req,
      res,
      statusCode,
      timings: buildUpstreamTimings({
        startedAtNs,
        ...timingPoints,
        finishedAtNs,
      }),
    });
  };

  const fail = ({ statusCode, body }) => {
    if (settled) return;
    settled = true;
    if (!res.headersSent) {
      res.send(statusCode, body, { "content-type": "text/plain" });
    } else {
      res.destroy();
    }
    onComplete?.({
      req,
      res,
      statusCode,
      timings: buildUpstreamTimings({
        startedAtNs,
        ...timingPoints,
        finishedAtNs: process.hrtime.bigint(),
      }),
    });
  };

  const upstream = http.request(
    {
      socketPath,
      method: req.method,
      path: req.url,
      headers: { ...req.headers },
      agent,
    },
    (upstreamRes) => {
      if (settled) return;
      settled = true;
      timingPoints.upstreamResponseAtNs = process.hrtime.bigint();
      const statusCode = upstreamRes.statusCode || 502;

      upstreamRes.on("error", () => res.destroy());
      res.on("error", () => upstreamRes.destroy());

      res.writeHead(statusCode, upstreamRes.headers);
      res.once("finish", () => complete(statusCode));
      upstreamRes.pipe(res);
    },
  );

  upstream.on("socket", (socket) => {
    timingPoints.upstreamSocketAtNs = process.hrtime.bigint();
    if (socket.connecting) {
      socket.once("connect", () => {
        timingPoints.upstreamConnectedAtNs = process.hrtime.bigint();
      });
      return;
    }
    timingPoints.upstreamConnectedAtNs = timingPoints.upstreamSocketAtNs;
  });

  upstream.setTimeout(timeoutMs, () => {
    upstream.destroy();
    fail({
      statusCode: 504,
      body: "Gateway Timeout",
    });
  });

  upstream.on("error", (err) => {
    void err;
    fail({
      statusCode: 503,
      body: "Service Unavailable",
    });
  });

  req.on("aborted", () => upstream.destroy());
  req.on("error", (err) => {
    upstream.destroy();
    fail({
      statusCode: 400,
      body: "Bad Request",
    });
  });
  res.on("close", () => !res.writableEnded && upstream.destroy());

  req.pipe(upstream);
}

function createProxyServer({
  socketPath,
  port,
  timeoutMs,
  maxBodyBytes,
  onRequest,
  onComplete,
  onListen,
}) {
  const agent = new http.Agent({ keepAlive: true });

  const server = http.createServer(async (req, res) => {
    const startedAtNs = process.hrtime.bigint();
    attachRequestHelpers(req, { maxBodyBytes });
    attachResponseHelpers(res);

    let shouldForward = false;
    const forward = () => {
      shouldForward = true;
    };

    const handled = await onRequest?.({ req, res, startedAtNs, forward });
    if (!shouldForward && (handled || res.writableEnded || res.headersSent)) {
      onComplete?.({
        req,
        res,
        statusCode: res.statusCode,
        timings: {
          totalMs: roundedDuration(startedAtNs, process.hrtime.bigint()),
        },
      });
      return;
    }

    proxyToUpstream({
      req,
      res,
      socketPath,
      agent,
      timeoutMs,
      startedAtNs,
      onComplete,
    });
  });

  server.on("clientError", (_err, socket) => {
    if (socket.writable) {
      socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    } else {
      socket.destroy();
    }
  });

  server.on("upgrade", (req, socket, head) => {
    proxyWebSocketUpgrade({ req, socket, head, socketPath });
  });

  server.listen(port, () => {
    onListen?.({ port, socketPath });
  });

  return server;
}

module.exports = {
  createProxyServer,
};

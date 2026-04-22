/**
 * Core proxy framework for febib-serve.
 *
 * Provides the HTTP/WebSocket proxy server, request/response helper methods,
 * upstream timing collection, and lifecycle callbacks (`onRequest`, `onComplete`).
 */
const http = require("node:http");
const net = require("node:net");
const { log } = require("dbc-node-logger");

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
      if (!rawBody.trim()) {
        settleResolve({});
        return;
      }
      try {
        settleResolve(JSON.parse(rawBody));
      } catch {
        settleReject(400, "Invalid JSON");
      }
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

function runUpstreamRequest({
  req,
  res,
  socketPath,
  agent,
  timeoutMs,
  startedAtNs,
}) {
  return new Promise((resolve) => {
    let done = false;
    let clientClosed = false;
    const timingPoints = {
      upstreamStartedAtNs: process.hrtime.bigint(),
    };

    const finish = ({ statusCode, failure }) => {
      if (done) return;
      done = true;
      resolve({
        statusCode,
        timings: buildUpstreamTimings({
          startedAtNs,
          ...timingPoints,
          finishedAtNs: process.hrtime.bigint(),
        }),
        failure,
      });
    };

    const failResponse = ({ statusCode, body, failure, sendResponse = true }) => {
      if (sendResponse && !res.headersSent) {
        res.send(statusCode, body, { "content-type": "text/plain" });
      } else if (!res.writableEnded) {
        res.destroy();
      }
      finish({ statusCode, failure });
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
        if (done) return;
        timingPoints.upstreamResponseAtNs = process.hrtime.bigint();
        const statusCode = upstreamRes.statusCode || 502;

        upstreamRes.on("error", () => !res.writableEnded && res.destroy());
        res.on("error", () => upstreamRes.destroy());

        res.writeHead(statusCode, upstreamRes.headers);
        res.once("finish", () => finish({ statusCode }));
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
      failResponse({
        statusCode: 504,
        body: "Gateway Timeout",
        failure: {
          reason: "upstream_timeout",
          message: "Gateway Timeout",
        },
      });
    });

    upstream.on("error", (error) => {
      if (clientClosed) {
        failResponse({
          statusCode: 499,
          body: "Client Closed Request",
          sendResponse: false,
          failure: {
            reason: "client_aborted",
            message: "Client Closed Request",
          },
        });
        return;
      }

      failResponse({
        statusCode: 503,
        body: "Service Unavailable",
        failure: {
          reason: "upstream_error",
          message: "Service Unavailable",
          error: String(error),
          code: error?.code,
        },
      });
    });

    req.on("aborted", () => {
      clientClosed = true;
      failResponse({
        statusCode: 499,
        body: "Client Closed Request",
        sendResponse: false,
        failure: {
          reason: "client_aborted",
          message: "Client Closed Request",
        },
      });
      upstream.destroy();
    });

    req.on("error", () => {
      upstream.destroy();
      failResponse({
        statusCode: 400,
        body: "Bad Request",
        failure: {
          reason: "request_error",
          message: "Bad Request",
        },
      });
    });

    res.on("close", () => {
      if (res.writableEnded) return;
      clientClosed = true;
      failResponse({
        statusCode: 499,
        body: "Client Closed Request",
        sendResponse: false,
        failure: {
          reason: "client_aborted",
          message: "Client Closed Request",
        },
      });
      upstream.destroy();
    });

    req.pipe(upstream);
  });
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

    let result;
    try {
      const handled = await onRequest?.({ req, res, startedAtNs, forward });
      if (!shouldForward && (handled || res.writableEnded || res.headersSent)) {
        result = {
          statusCode: res.statusCode,
          timings: {
            totalMs: roundedDuration(startedAtNs, process.hrtime.bigint()),
          },
        };
      } else {
        result = await runUpstreamRequest({
          req,
          res,
          socketPath,
          agent,
          timeoutMs,
          startedAtNs,
        });
      }
    } catch (error) {
      if (!res.headersSent && !res.writableEnded) {
        res.send(500, "Internal Server Error", { "content-type": "text/plain" });
      } else if (!res.writableEnded) {
        res.destroy();
      }

      result = {
        statusCode: res.statusCode || 500,
        timings: {
          totalMs: roundedDuration(startedAtNs, process.hrtime.bigint()),
        },
        failure: {
          reason: "on_request_error",
          message: "Internal Server Error",
          error: String(error),
        },
      };
    }

    try {
      onComplete?.({
        req,
        res,
        statusCode: result.statusCode,
        timings: result.timings,
        failure: result.failure,
      });
    } catch (error) {
      log.error("onComplete failed", {
        method: req.method,
        url: req.url,
        statusCode: result.statusCode,
        error: String(error),
      });
    }
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

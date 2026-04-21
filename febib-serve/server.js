/**
 * Reverse proxy in front of the app socket server.
 *
 * - Local routes: `/health`, `/api/errorLogger`
 * - Everything else proxied over Unix socket to app server
 * - WebSocket upgrade passthrough for Next.js HMR
 */
const { log } = require("dbc-node-logger");
const isbot = require("isbot");
const {
  PORT,
  UPSTREAM_TIMEOUT_MS,
  CLIENT_JS_ERROR_BODY_LIMIT_BYTES,
} = require("./config");
const { handleHealthRoute, HEALTH_PATH } = require("./routes/health");
const { handleClientErrorsRoute } = require("./routes/clientErrors");
const { recordHttpRequestResult } = require("./utils/metrics");
const { getHeaderValue, extractClientIp } = require("./utils/headers");
const { createProxyServer } = require("./core/proxyServer");
const socketPath = process.env.FEBIB_SERVE_SOCKET_PATH;

if (!socketPath) {
  throw new Error("Missing FEBIB_SERVE_SOCKET_PATH in runtime environment.");
}

createProxyServer({
  socketPath,
  port: PORT,
  timeoutMs: UPSTREAM_TIMEOUT_MS,
  maxBodyBytes: CLIENT_JS_ERROR_BODY_LIMIT_BYTES,
  onRequest: async ({ req, res, forward }) => {
    if (await handleHealthRoute({ req, res })) {
      return;
    }

    if (await handleClientErrorsRoute({ req, res })) {
      return;
    }

    return forward();
  },
  onComplete: ({ req, statusCode, timings = {} }) => {
    const totalMs = timings.totalMs ?? timings.upstreamTotalMs ?? 0;
    const userAgentValue = getHeaderValue(req.headers["user-agent"]);
    const ip = extractClientIp(req);
    if (!(req.url === HEALTH_PATH && req.method === "GET")) {
      recordHttpRequestResult(statusCode, totalMs);
    }

    log.info("request completed", {
      method: req.method,
      url: req.url,
      ip,
      userAgent: userAgentValue,
      userAgentIsBot:
        typeof userAgentValue === "string" ? isbot(userAgentValue) : false,
      statusCode,
      timings: {
        upstreamQueueMs: timings.upstreamQueueMs,
        upstreamConnectMs: timings.upstreamConnectMs,
        upstreamTtfbMs: timings.upstreamTtfbMs,
        upstreamResponseMs: timings.upstreamResponseMs,
        upstreamTotalMs: timings.upstreamTotalMs,
      },
    });
  },
  onListen: ({ port, socketPath }) => {
    log.info("proxy started", {
      proxyUrl: `http://localhost:${port}`,
      targetSocketPath: socketPath,
    });
  },
});

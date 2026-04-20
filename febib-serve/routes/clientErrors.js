const { log } = require("dbc-node-logger");
const { inc, JS_CLIENT_ERROR } = require("../utils/metrics");

const CLIENT_ERRORS_PATH = "/api/errorLogger";
const CLIENT_JS_ERROR_LOG_DELAY_MS = 5000;

let lastClientJsErrorLogAt = 0;

async function handleClientErrorsRoute({ req, res }) {
  if (req.url !== CLIENT_ERRORS_PATH || req.method !== "POST") return false;

  try {
    const parsedBody = await req.parseBody();
    const now = Date.now();
    if (now - lastClientJsErrorLogAt > CLIENT_JS_ERROR_LOG_DELAY_MS) {
      lastClientJsErrorLogAt = now;
      log.error("CLIENT JS ERROR", {
        clientJsError: {
          message: parsedBody.message?.slice(0, 500),
          stack: parsedBody.stack?.slice(0, 500),
          componentStack: parsedBody.componentStack?.slice(0, 500),
        },
      });
    }

    if (res.sendJson(200, { message: "OK" })) {
      inc(JS_CLIENT_ERROR);
    }
  } catch (err) {
    res.sendJson(err?.statusCode ?? 400, { message: err?.message ?? "Bad Request" });
  }

  return true;
}

module.exports = {
  CLIENT_ERRORS_PATH,
  handleClientErrorsRoute,
};

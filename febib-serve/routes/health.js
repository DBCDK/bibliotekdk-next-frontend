const { log } = require("dbc-node-logger");
const { MAX_CLIENT_ERROR_COUNT, MAX_5XX_COUNT } = require("../config");
const {
  JS_CLIENT_ERROR,
  getWindowCounts,
  getWindowResponseTimeStats,
} = require("../utils/metrics");

const HEALTH_PATH = "/health";
const HTTP_KEY = /^HTTP_(\d+)$/;
const upSince = new Date();
const maxClientErrorCount = MAX_CLIENT_ERROR_COUNT;
const max5xxCount = MAX_5XX_COUNT;

function sumStatusBand(counts, minCode, maxCode) {
  let sum = 0;
  for (const [k, n] of Object.entries(counts)) {
    const m = k.match(HTTP_KEY);
    if (!m) continue;
    const c = Number(m[1]);
    if (!Number.isFinite(c) || c < minCode || c > maxCode) continue;
    sum += Number(n) || 0;
  }
  return sum;
}

function buildHealthResponse() {
  const counts = getWindowCounts();
  const responseTimesMs = getWindowResponseTimeStats();
  const count5xx = sumStatusBand(counts, 500, 599);
  const clientErrorsCount = Number(counts[JS_CLIENT_ERROR] ?? 0);
  const ok5xx = count5xx < max5xxCount;
  const okClientErrors = clientErrorsCount < maxClientErrorCount;
  const ok = ok5xx && okClientErrors;

  const errors = [];
  if (!ok5xx) {
    errors.push(`Rolling 5m HTTP 5xx count ${count5xx} must be < ${max5xxCount}`);
  }
  if (!okClientErrors) {
    errors.push(
      `Rolling 5m ${JS_CLIENT_ERROR}: ${clientErrorsCount} must be < ${maxClientErrorCount}`,
    );
  }

  const body = {
    ok,
    upSince,
    "metrics-5min": {
      counts,
      responseTimesMs,
      ok,
      errors,
    },
  };

  if (!ok) {
    log.info("health check failed", { check: "metrics-5min", errors });
  }

  log.info("health status", {
    healthStatus: { ok, upSince, body: JSON.stringify(body) },
  });

  return {
    statusCode: ok ? 200 : 500,
    body,
  };
}

function handleHealthRoute({ req, res }) {
  if (req.url !== HEALTH_PATH || req.method !== "GET") return false;
  const { statusCode, body } = buildHealthResponse();
  res.sendJson(statusCode, body);
  return true;
}

module.exports = {
  HEALTH_PATH,
  handleHealthRoute,
};

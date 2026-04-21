/**
 * Health route for febib-serve (`GET /health`).
 *
 * Combines rolling metrics, process usage, thresholds, and grace-window state
 * into one health response used for status checks and alerting.
 */
const { log } = require("dbc-node-logger");
const {
  HEALTH_GRACE_WINDOW_SECONDS,
  THRESHOLD_JS_CLIENT_ERROR_COUNT,
  THRESHOLD_HTTP_5XX_COUNT,
  THRESHOLD_APP_CPU_USAGE,
  THRESHOLD_RESPONSE_TIME_P95_MS,
} = require("../config");
const {
  JS_CLIENT_ERROR,
  getWindowCounts,
  getWindowResponseTimeStats,
} = require("../utils/metrics");
const { getProcessUsageSnapshot } = require("../utils/processUsage");

const HEALTH_PATH = "/health";
const METRICS_WINDOW_SECONDS = 5 * 60;
const HTTP_KEY = /^HTTP_(\d+)$/;
const upSince = new Date();
const thresholdJsClientErrorCount = THRESHOLD_JS_CLIENT_ERROR_COUNT;
const thresholdHttp5xxCount = THRESHOLD_HTTP_5XX_COUNT;
const thresholdAppCpuUsage = THRESHOLD_APP_CPU_USAGE;
const thresholdResponseTimeP95Ms = THRESHOLD_RESPONSE_TIME_P95_MS;
const healthGraceWindowSeconds = HEALTH_GRACE_WINDOW_SECONDS;

function isDisabledThreshold(value) {
  return Number(value) === 0;
}

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
  const processUsage = getProcessUsageSnapshot();
  const appCpuUsage = processUsage?.app?.cpuUsage;
  const responseTimeP95 = responseTimesMs?.p95;
  const count5xx = sumStatusBand(counts, 500, 599);
  const clientErrorsCount = Number(counts[JS_CLIENT_ERROR] ?? 0);
  const upForMs = Date.now() - upSince.getTime();
  const graceWindowActive =
    healthGraceWindowSeconds > 0 && upForMs < healthGraceWindowSeconds * 1000;
  const ok5xx =
    isDisabledThreshold(thresholdHttp5xxCount) ||
    count5xx < thresholdHttp5xxCount;
  const okClientErrors =
    isDisabledThreshold(thresholdJsClientErrorCount) ||
    clientErrorsCount < thresholdJsClientErrorCount;
  const okCpu =
    isDisabledThreshold(thresholdAppCpuUsage) ||
    !Number.isFinite(appCpuUsage) || Number(appCpuUsage) <= thresholdAppCpuUsage;
  const okResponseTimeP95 =
    isDisabledThreshold(thresholdResponseTimeP95Ms) ||
    !Number.isFinite(responseTimeP95) ||
    Number(responseTimeP95) <= thresholdResponseTimeP95Ms;
  const thresholdsOk = ok5xx && okClientErrors && okCpu && okResponseTimeP95;
  const ok = graceWindowActive ? true : thresholdsOk;

  const errors = [];
  if (!graceWindowActive && !ok5xx) {
    errors.push(
      `Rolling 5m HTTP 5xx count ${count5xx} must be < ${thresholdHttp5xxCount}`,
    );
  }
  if (!graceWindowActive && !okClientErrors) {
    errors.push(
      `Rolling 5m ${JS_CLIENT_ERROR}: ${clientErrorsCount} must be < ${thresholdJsClientErrorCount}`,
    );
  }
  if (!graceWindowActive && !okCpu) {
    errors.push(
      `Rolling 1m app cpuUsage ${appCpuUsage}% must be <= ${thresholdAppCpuUsage}%`,
    );
  }
  if (!graceWindowActive && !okResponseTimeP95) {
    errors.push(
      `Rolling 5m responseTimesMs.p95 ${responseTimeP95}ms must be <= ${thresholdResponseTimeP95Ms}ms`,
    );
  }

  const body = {
    ok,
    upSince,
    errors,
    thresholds: {
      http5xxCount: thresholdHttp5xxCount,
      jsClientErrorCount: thresholdJsClientErrorCount,
      appCpuUsage: thresholdAppCpuUsage,
      responseTimeP95Ms: thresholdResponseTimeP95Ms,
      // Same semantics as threshold values: 0 means disabled.
      healthGraceWindowSeconds,
    },
    graceWindow: {
      seconds: healthGraceWindowSeconds,
      active: graceWindowActive,
    },
    metrics: {
      windowSeconds: METRICS_WINDOW_SECONDS,
      counts,
      responseTimesMs,
    },
    processUsage,
  };

  if (!ok) {
    log.info("health check failed", { check: "metrics", errors });
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

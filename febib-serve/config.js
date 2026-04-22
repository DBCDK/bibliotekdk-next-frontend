/**
 * Runtime configuration for febib-serve.
 *
 * Defines defaults and resolves supported environment variables
 * used by the proxy runtime, routes, and health thresholds.
 */
const DEFAULT_PORT = 3000;
const DEFAULT_UPSTREAM_TIMEOUT_MS = 30000;
const DEFAULT_HEALTH_GRACE_WINDOW_SECONDS = 30;
const DEFAULT_THRESHOLD_JS_CLIENT_ERROR_COUNT = 50;
const DEFAULT_THRESHOLD_HTTP_5XX_COUNT = 50;
const DEFAULT_THRESHOLD_APP_CPU_USAGE = 100;
const DEFAULT_THRESHOLD_RESPONSE_TIME_P95_MS = 3000;
const DEFAULT_CLIENT_JS_ERROR_BODY_LIMIT_BYTES = 32 * 1024;

function numFromEnv(name, fallback, { min, max, integer = false } = {}) {
  const raw = process.env[name];
  if (typeof raw === "undefined" || raw === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  if (integer && !Number.isInteger(parsed)) return fallback;
  if (typeof min === "number" && parsed < min) return fallback;
  if (typeof max === "number" && parsed > max) return fallback;
  return parsed;
}

const PORT = numFromEnv("PORT", DEFAULT_PORT, {
  min: 1,
  max: 65535,
  integer: true,
});
const UPSTREAM_TIMEOUT_MS = numFromEnv(
  "UPSTREAM_TIMEOUT_MS",
  DEFAULT_UPSTREAM_TIMEOUT_MS,
  { min: 0 },
);
const HEALTH_GRACE_WINDOW_SECONDS = numFromEnv(
  "HEALTH_GRACE_WINDOW_SECONDS",
  DEFAULT_HEALTH_GRACE_WINDOW_SECONDS,
  { min: 0, integer: true },
);
const THRESHOLD_JS_CLIENT_ERROR_COUNT = numFromEnv(
  "THRESHOLD_JS_CLIENT_ERROR_COUNT",
  DEFAULT_THRESHOLD_JS_CLIENT_ERROR_COUNT,
  { min: 0 },
);
const THRESHOLD_HTTP_5XX_COUNT = numFromEnv(
  "THRESHOLD_HTTP_5XX_COUNT",
  DEFAULT_THRESHOLD_HTTP_5XX_COUNT,
  { min: 0 },
);
const THRESHOLD_APP_CPU_USAGE = numFromEnv(
  "THRESHOLD_APP_CPU_USAGE",
  DEFAULT_THRESHOLD_APP_CPU_USAGE,
  { min: 0 },
);
const THRESHOLD_RESPONSE_TIME_P95_MS = numFromEnv(
  "THRESHOLD_RESPONSE_TIME_P95_MS",
  DEFAULT_THRESHOLD_RESPONSE_TIME_P95_MS,
  { min: 0 },
);
const CLIENT_JS_ERROR_BODY_LIMIT_BYTES = numFromEnv(
  "CLIENT_JS_ERROR_BODY_LIMIT_BYTES",
  DEFAULT_CLIENT_JS_ERROR_BODY_LIMIT_BYTES,
  { min: 1, integer: true },
);

module.exports = {
  PORT,
  UPSTREAM_TIMEOUT_MS,
  HEALTH_GRACE_WINDOW_SECONDS,
  THRESHOLD_JS_CLIENT_ERROR_COUNT,
  THRESHOLD_HTTP_5XX_COUNT,
  THRESHOLD_APP_CPU_USAGE,
  THRESHOLD_RESPONSE_TIME_P95_MS,
  CLIENT_JS_ERROR_BODY_LIMIT_BYTES,
};

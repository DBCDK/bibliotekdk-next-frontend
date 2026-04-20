const DEFAULT_NEXT_SOCKET_PATH = "/tmp/next-app.sock";
const DEFAULT_PROXY_PORT = 3000;
const DEFAULT_UPSTREAM_TIMEOUT_MS = 30000;
const DEFAULT_MAX_CLIENT_ERROR_COUNT = 10;
const DEFAULT_MAX_5XX_COUNT = 10;
const DEFAULT_CLIENT_JS_ERROR_BODY_LIMIT_BYTES = 32 * 1024;

function numFromEnv(name, fallback) {
  const raw = process.env[name];
  if (typeof raw === "undefined" || raw === "") return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

const NEXT_SOCKET_PATH =
  process.env.NEXT_SOCKET_PATH || DEFAULT_NEXT_SOCKET_PATH;
const PROXY_PORT = numFromEnv("PROXY_PORT", DEFAULT_PROXY_PORT);
const UPSTREAM_TIMEOUT_MS = numFromEnv(
  "UPSTREAM_TIMEOUT_MS",
  DEFAULT_UPSTREAM_TIMEOUT_MS,
);
const MAX_CLIENT_ERROR_COUNT = numFromEnv(
  "MAX_ERROR_COUNT",
  DEFAULT_MAX_CLIENT_ERROR_COUNT,
);
const MAX_5XX_COUNT = numFromEnv("HOWRU_MAX_5XX_COUNT", DEFAULT_MAX_5XX_COUNT);
const CLIENT_JS_ERROR_BODY_LIMIT_BYTES = numFromEnv(
  "CLIENT_JS_ERROR_BODY_LIMIT_BYTES",
  DEFAULT_CLIENT_JS_ERROR_BODY_LIMIT_BYTES,
);

module.exports = {
  NEXT_SOCKET_PATH,
  PROXY_PORT,
  UPSTREAM_TIMEOUT_MS,
  MAX_CLIENT_ERROR_COUNT,
  MAX_5XX_COUNT,
  CLIENT_JS_ERROR_BODY_LIMIT_BYTES,
};

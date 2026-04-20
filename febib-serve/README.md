# Server Runtime Overview

This folder contains a small runtime layer in front of the application server.
When the app process is heavily loaded, timing measurements inside the app can become skewed. For example, request start time can be recorded too late if the event loop is blocked.
This runtime starts a separate proxy process to avoid that problem. The proxy does no heavy application work and focuses on simple request logging and metric collection.
It is intended to run as a standalone CLI with sane monitoring defaults.

Primary goals:

- provide one stable HTTP entrypoint (`server.js`)
- collect status-code and response-time metrics across all traffic
- keep metrics collection in the runtime process, separate from the app event loop
- expose a `/health` endpoint with HTTP status-code distribution and performance percentiles
- support simple alarm rules based on these signals
- accept client-side JS error reports via `/api/errorLogger`

The app server runs behind a Unix socket. The proxy handles the public HTTP interface.

## Request Flow

1. `server.js` initializes `createProxyServer(...)` from `core/proxyServer.js`.
2. `onRequest` checks local routes first:
   - `GET /health`
   - `POST /api/errorLogger`
3. If no local route handles the request, `forward()` sends it to the upstream app over the Unix socket.
4. `onComplete` runs for both local and upstream responses:
   - records `HTTP_<status>` and response time in the rolling metrics window
   - logs request completion

## Runtime Contract

The supported control surface is intentionally small:

- adapter and start mode via CLI arguments (`next dev` or `next start`)
- runtime environment variables from `config.js`
- built-in endpoints: `GET /health` and `POST /api/errorLogger`

This runtime is not designed for local extension via plugins or custom route injection.

## CLI Usage (Local Workspace)

The runtime is packaged as a local workspace CLI:

- workspace package: `@dbcdk/febib-serve`
- bin command: `febib-serve`

Typical usage from repository root:

- `febib-serve next dev`
- `febib-serve next start`

## Structure and Responsibilities

- `cli.js`

  - CLI process orchestrator
  - starts app adapter and proxy process
  - handles shutdown for both processes

- `server.js`

  - runtime composition entrypoint
  - wires routes and proxy framework
  - defines centralized `onComplete` metrics/logging behavior

- `core/proxyServer.js`

  - proxy framework (`createProxyServer`)
  - request/response helpers (`req.parseBody`, `res.send`, `res.sendJson`)
  - upstream HTTP proxying and WebSocket upgrade passthrough
  - timeout/error handling and timing collection

- `routes/health.js`

  - handles `GET /health`
  - builds health payload from rolling metrics
  - evaluates threshold rules (`MAX_ERROR_COUNT`, `HOWRU_MAX_5XX_COUNT`)

- `routes/clientErrors.js`

  - handles `POST /api/errorLogger`
  - parses payload and logs/throttles client JS errors
  - increments `JS_CLIENT_ERROR` on accepted reports

- `utils/metrics.js`

  - rolling 5-minute counters (`HTTP_*`, `JS_CLIENT_ERROR`)
  - rolling 5-minute response-time histogram and percentile estimates

- `adapters/next-app-server.js`

  - current concrete adapter implementation
  - binds the current app server to `NEXT_SOCKET_PATH`

- `config.js`
  - runtime defaults and env-based configuration

## Health Endpoint Scope

`/health` reports performance metrics and HTTP status codes:

- rolling 5xx volume
- rolling client JS error volume
- proxy-layer response-time stats

`metrics-5min.ok` is the alarm summary flag.  
`metrics-5min.errors` contains threshold violations.

Application/domain dependency checks should remain in separate application-specific health endpoints.

## Why This Layer Exists With Central HAProxy

Central HAProxy remains the global ingress layer (routing, shared policy, protections).
This local runtime layer provides service-local observability:

- service-specific rolling health signals
- consistent status/timing metrics at the service boundary
- alarm semantics independent of application-framework internals

Both layers are complementary: HAProxy for platform-level ingress, runtime proxy for service-level health signals.

## Current Scope

- only the Next.js app adapter is implemented and supported
- runtime behavior is fixed to provide consistent, low-bloat monitoring defaults

## Key Configuration

Defined in `config.js`:

- `NEXT_SOCKET_PATH` (default `/tmp/next-app.sock`)
- `PROXY_PORT` (default `3000`)
- `UPSTREAM_TIMEOUT_MS` (default `30000`)
- `MAX_ERROR_COUNT` (max allowed rolling `JS_CLIENT_ERROR`, default `10`)
- `HOWRU_MAX_5XX_COUNT` (max allowed rolling 5xx count, default `10`)
- `CLIENT_JS_ERROR_BODY_LIMIT_BYTES` (default `32768`)

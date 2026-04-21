/**
 * Next.js app adapter for febib-serve.
 *
 * Boots the Next.js server and binds it to the runtime-provided Unix socket
 * used internally by the local proxy process.
 */
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const next = require("next");
const { log } = require("dbc-node-logger");

const workspaceRoot = path.resolve(__dirname, "../..");
require(path.join(workspaceRoot, "logger.js"));
const socketPath = process.env.FEBIB_SERVE_SOCKET_PATH;

if (!socketPath) {
  throw new Error("Missing FEBIB_SERVE_SOCKET_PATH in runtime environment.");
}

const mode = process.argv[2] || "dev";
if (mode !== "start" && mode !== "dev") {
  throw new Error(`Invalid mode "${mode}". Expected "dev" or "start".`);
}
const dev = mode === "dev";

function safeUnlinkSocket(socketPath) {
  try {
    fs.rmSync(socketPath, { force: true });
  } catch (error) {
    log.warn("failed to remove stale next socket", {
      socketPath,
      error: String(error),
    });
  }
}

async function main() {
  safeUnlinkSocket(socketPath);

  const app = next({ dev, dir: workspaceRoot });
  const handle = app.getRequestHandler();
  await app.prepare();

  const server = http.createServer((req, res) => handle(req, res));
  process.on("exit", () => safeUnlinkSocket(socketPath));

  server.on("error", (error) => {
    log.error("next socket server failed", { error: String(error) });
    process.exit(1);
  });

  server.listen(socketPath, () => {
    log.info("next app socket server started", {
      mode,
      nextSocketPath: socketPath,
    });
  });
}

main().catch((error) => {
  log.error("failed to start next app socket server", {
    error: String(error),
  });
  process.exit(1);
});

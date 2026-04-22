#!/usr/bin/env node

/**
 * febib-serve CLI entrypoint.
 *
 * Starts the app adapter process and the local proxy process,
 * wires shared runtime environment values, and coordinates shutdown.
 */
const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");

const adapter = process.argv[2];
if (!adapter) {
  throw new Error('Missing adapter. Usage: "febib-serve next <dev|start>"');
}
if (adapter !== "next") {
  throw new Error(`Unsupported adapter "${adapter}". Only "next" is supported.`);
}

const mode = process.argv[3] || "dev";
if (mode !== "start" && mode !== "dev") {
  throw new Error(`Invalid mode "${mode}". Expected "dev" or "start".`);
}
const workspaceRoot = path.resolve(__dirname, "..");
const serverEntryInput =
  process.env.RUNTIME_SERVER_ENTRY || "febib-serve/adapters/next-app-server.js";
const serverEntryPath = path.isAbsolute(serverEntryInput)
  ? serverEntryInput
  : path.resolve(workspaceRoot, serverEntryInput);

const PUBLIC_PORT = String(process.env.PORT || "3000");
const SOCKET_PATH = `/tmp/febib-serve-${process.pid}-${Date.now().toString(
  36,
)}.sock`;

const baseEnv = {
  ...process.env,
  PORT: PUBLIC_PORT,
  FEBIB_SERVE_SOCKET_PATH: SOCKET_PATH,
};
const SHUTDOWN_FORCE_KILL_TIMEOUT_MS = 10_000;

if (!fs.existsSync(serverEntryPath)) {
  // Keep runtime failure explicit when swapping app server implementation.
  throw new Error(`Runtime server entry not found: ${serverEntryPath}`);
}

const appProc = spawn(
  process.execPath,
  [serverEntryPath, mode, ...process.argv.slice(4)],
  {
    cwd: workspaceRoot,
    env: baseEnv,
    stdio: "inherit",
  },
);

const proxyProc = spawn(process.execPath, [path.join(__dirname, "server.js")], {
  cwd: workspaceRoot,
  env: {
    ...baseEnv,
    APP_PID: String(appProc.pid),
  },
  stdio: "inherit",
});

let stopping = false;
let forceKillTimer;
let appExitCode = 0;
let proxyExitCode = 0;
let appExited = false;
let proxyExited = false;

function stopBoth(signal = "SIGTERM") {
  if (!stopping) {
    stopping = true;
    if (!appProc.killed) appProc.kill(signal);
    if (!proxyProc.killed) proxyProc.kill(signal);
  }

  if (forceKillTimer) return;
  forceKillTimer = setTimeout(() => {
    if (!appProc.killed) appProc.kill("SIGKILL");
    if (!proxyProc.killed) proxyProc.kill("SIGKILL");
  }, SHUTDOWN_FORCE_KILL_TIMEOUT_MS);
  if (typeof forceKillTimer.unref === "function") {
    forceKillTimer.unref();
  }
}

function tryFinalize() {
  if (!appExited || !proxyExited) return;
  if (forceKillTimer) {
    clearTimeout(forceKillTimer);
  }
  const finalCode = appExitCode !== 0 ? appExitCode : proxyExitCode;
  process.exit(finalCode ?? 0);
}

function handleChildProcessError(name, error) {
  console.error(`[febib-serve] Failed to start ${name} process:`, String(error));
  if (name === "app") {
    appExited = true;
    appExitCode = 1;
  } else {
    proxyExited = true;
    proxyExitCode = 1;
  }
  stopBoth("SIGTERM");
  tryFinalize();
}

process.on("SIGINT", () => stopBoth("SIGINT"));
process.on("SIGTERM", () => stopBoth("SIGTERM"));
appProc.on("error", (error) => handleChildProcessError("app", error));
proxyProc.on("error", (error) => handleChildProcessError("proxy", error));

appProc.on("exit", (code, signal) => {
  appExited = true;
  appExitCode = typeof code === "number" ? code : signal ? 1 : 0;
  if (!proxyProc.killed) proxyProc.kill("SIGTERM");
  tryFinalize();
});

proxyProc.on("exit", (code, signal) => {
  proxyExited = true;
  proxyExitCode = typeof code === "number" ? code : signal ? 1 : 0;
  if (!appProc.killed) appProc.kill("SIGTERM");
  tryFinalize();
});

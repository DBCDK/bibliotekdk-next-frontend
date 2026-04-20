#!/usr/bin/env node

const path = require("node:path");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { NEXT_SOCKET_PATH } = require("./config");

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

const baseEnv = {
  ...process.env,
  PROXY_PORT: PUBLIC_PORT,
  NEXT_SOCKET_PATH,
};

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
  env: baseEnv,
  stdio: "inherit",
});

let stopping = false;

function stopBoth(signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;
  if (!appProc.killed) appProc.kill(signal);
  if (!proxyProc.killed) proxyProc.kill(signal);
}

process.on("SIGINT", () => stopBoth("SIGINT"));
process.on("SIGTERM", () => stopBoth("SIGTERM"));

appProc.on("exit", (code) => {
  if (!proxyProc.killed) proxyProc.kill("SIGTERM");
  process.exit(code ?? 0);
});

proxyProc.on("exit", (code) => {
  if (!appProc.killed) appProc.kill("SIGTERM");
  process.exit(code ?? 0);
});

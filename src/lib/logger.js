/**
 * @file This must be loaded before 'next start'
 *
 * It will override the NextJS logger, making it use dbc-node-logger (JSON) underneath.
 * Use NODE_OPTIONS to load it.
 * Ex.:
 *
 * "start:next": "NODE_OPTIONS='--require ./src/lib/logger' next start"
 *
 */

const nextLogger = require("next/dist/build/output/log");
const { log } = require("dbc-node-logger");

// Unhandled server errors logged by logError in the next server
// https://github.com/vercel/next.js/blob/eb629c15ca55c247d216963a16abc1bea60d7f91/packages/next/server/base-server.ts#L436
console.error = (e) => {
  // We do not log here, because this error is logged in _error.js
  // where we also have information about which url is visited
};

// Use the dbc-logger for internal NextJS events
Object.keys(nextLogger.prefixes).forEach((method) => {
  const logFunc = log[method] || log.info;
  nextLogger[method] = (msg) => logFunc(msg);
});

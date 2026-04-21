/**
 * Process usage sampler for febib-serve.
 *
 * Polls OS-level CPU and memory for app/proxy processes every 5 seconds,
 * stores samples in a fixed ring buffer, and exposes 1-minute averages.
 */
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);
const POLL_INTERVAL_MS = 5000;
const MAX_BUCKETS = 12;
const WINDOW_SECONDS = (POLL_INTERVAL_MS * MAX_BUCKETS) / 1000;

const APP_PID = Number(process.env.APP_PID || 0);
const PROXY_PID = process.pid;

const ringBuffer = Array.from({ length: MAX_BUCKETS });
let sampleWriteIndex = 0;
let sampleCount = 0;
let pollTimer;
let isSampling = false;

function round1(value) {
  if (!Number.isFinite(value)) return undefined;
  return Number(value.toFixed(1));
}

function parseNumber(raw) {
  if (typeof raw !== "string") return undefined;
  const normalized = raw.replace(",", ".").replace("%", "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function readPidUsage(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return undefined;

  try {
    const { stdout } = await execFileAsync("ps", ["-o", "%cpu=,rss=", "-p", String(pid)]);
    const line = stdout
      .split("\n")
      .map((value) => value.trim())
      .find(Boolean);
    if (!line) return undefined;

    const [cpuRaw, rssKbRaw] = line.split(/\s+/);
    const cpuPercent = parseNumber(cpuRaw);
    const rssKb = parseNumber(rssKbRaw);

    return {
      pid,
      cpuPercent: round1(cpuPercent),
      memoryMb: round1(rssKb / 1024),
    };
  } catch {
    return undefined;
  }
}

async function sampleUsage({ appPid, proxyPid }) {
  const [app, proxy] = await Promise.all([
    readPidUsage(appPid),
    readPidUsage(proxyPid),
  ]);

  return {
    sampledAt: new Date().toISOString(),
    app,
    proxy,
  };
}

function pushSample(sample) {
  ringBuffer[sampleWriteIndex] = sample;
  sampleWriteIndex = (sampleWriteIndex + 1) % MAX_BUCKETS;
  if (sampleCount < MAX_BUCKETS) sampleCount += 1;
}

function readSamples() {
  if (!sampleCount) return [];
  const startIndex = sampleCount === MAX_BUCKETS ? sampleWriteIndex : 0;
  const ordered = [];
  for (let i = 0; i < sampleCount; i += 1) {
    const idx = (startIndex + i) % MAX_BUCKETS;
    const sample = ringBuffer[idx];
    if (sample) ordered.push(sample);
  }
  return ordered;
}

function aggregateSeries(values) {
  const numeric = values.filter((value) => Number.isFinite(value));
  if (!numeric.length) return undefined;
  const sum = numeric.reduce((acc, value) => acc + value, 0);
  return round1(sum / numeric.length);
}

function aggregateProcess(samplesWindow, key) {
  const processSamples = samplesWindow
    .map((sample) => sample[key])
    .filter(Boolean);
  if (!processSamples.length) return undefined;

  return {
    pid: processSamples[processSamples.length - 1].pid,
    cpuUsage: aggregateSeries(processSamples.map((entry) => entry.cpuPercent)),
    memoryMb: aggregateSeries(processSamples.map((entry) => entry.memoryMb)),
  };
}

function pollOnce() {
  if (isSampling) return;
  isSampling = true;

  sampleUsage({ appPid: APP_PID, proxyPid: PROXY_PID })
    .then((sample) => {
      pushSample(sample);
    })
    .finally(() => {
      isSampling = false;
    });
}

function ensurePolling() {
  if (pollTimer) return;
  pollOnce();
  pollTimer = setInterval(pollOnce, POLL_INTERVAL_MS);
  if (typeof pollTimer.unref === "function") {
    pollTimer.unref();
  }
}

function getProcessUsageSnapshot() {
  ensurePolling();
  const samples = readSamples();

  return {
    windowSeconds: WINDOW_SECONDS,
    app: aggregateProcess(samples, "app"),
    proxy: aggregateProcess(samples, "proxy"),
  };
}

module.exports = {
  getProcessUsageSnapshot,
};

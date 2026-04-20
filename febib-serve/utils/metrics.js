/**
 * Shared rolling metrics (5 min):
 * - counts by key (HTTP_<status>, JS_CLIENT_ERROR, ...)
 * - response-time histogram for percentile estimates
 */

const BUCKET_MS = 10 * 1000;
const WINDOW_MS = 5 * 60 * 1000;
const BUCKET_COUNT = Math.floor(WINDOW_MS / BUCKET_MS);

const JS_CLIENT_ERROR = "JS_CLIENT_ERROR";

// Fixed response-time histogram bins in milliseconds (last bin is overflow).
const RESPONSE_TIME_BOUNDS_MS = [
  10, 20, 50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000, 10000,
];

const countStore = new Map();
const responseTimeStore = createResponseTimeStore();

function normalizeKey(key) {
  if (!key || typeof key !== "string") {
    throw new Error("metrics key must be a non-empty string");
  }
  const normalized = key.trim();
  if (!normalized) {
    throw new Error("metrics key must be a non-empty string");
  }
  return normalized;
}

function getBucketStart(now = Date.now()) {
  return Math.floor(now / BUCKET_MS) * BUCKET_MS;
}

function createCountBuckets() {
  return Array.from({ length: BUCKET_COUNT }, () => ({
    bucketStart: 0,
    count: 0,
  }));
}

function getOrCreateCountKeyStore(key) {
  if (!countStore.has(key)) {
    countStore.set(key, { buckets: createCountBuckets() });
  }
  return countStore.get(key);
}

function getCountBucket(store, bucketStart) {
  const bucketIndex = Math.floor(bucketStart / BUCKET_MS) % BUCKET_COUNT;
  const bucket = store.buckets[bucketIndex];

  if (bucket.bucketStart !== bucketStart) {
    bucket.bucketStart = bucketStart;
    bucket.count = 0;
  }

  return bucket;
}

function createResponseTimeBuckets() {
  const bins = RESPONSE_TIME_BOUNDS_MS.length + 1;
  return Array.from({ length: BUCKET_COUNT }, () => ({
    bucketStart: 0,
    count: 0,
    sum: 0,
    min: Number.POSITIVE_INFINITY,
    max: 0,
    binCounts: Array.from({ length: bins }, () => 0),
  }));
}

function createResponseTimeStore() {
  return {
    buckets: createResponseTimeBuckets(),
  };
}

function resetResponseTimeBucket(bucket, bucketStart) {
  bucket.bucketStart = bucketStart;
  bucket.count = 0;
  bucket.sum = 0;
  bucket.min = Number.POSITIVE_INFINITY;
  bucket.max = 0;
  bucket.binCounts.fill(0);
}

function getResponseTimeBucket(bucketStart) {
  const bucketIndex = Math.floor(bucketStart / BUCKET_MS) % BUCKET_COUNT;
  const bucket = responseTimeStore.buckets[bucketIndex];
  if (bucket.bucketStart !== bucketStart) {
    resetResponseTimeBucket(bucket, bucketStart);
  }
  return bucket;
}

function findResponseTimeBin(durationMs) {
  for (let i = 0; i < RESPONSE_TIME_BOUNDS_MS.length; i += 1) {
    if (durationMs <= RESPONSE_TIME_BOUNDS_MS[i]) return i;
  }
  return RESPONSE_TIME_BOUNDS_MS.length;
}

/** Increment counter for key (e.g. one response with that HTTP status). */
function inc(key) {
  const k = normalizeKey(key);
  const store = getOrCreateCountKeyStore(k);
  const bucket = getCountBucket(store, getBucketStart());
  bucket.count += 1;
}

function observeResponseTime(durationMs) {
  if (!Number.isFinite(durationMs) || durationMs < 0) return;
  const bucket = getResponseTimeBucket(getBucketStart());
  bucket.count += 1;
  bucket.sum += durationMs;
  if (durationMs < bucket.min) bucket.min = durationMs;
  if (durationMs > bucket.max) bucket.max = durationMs;
  bucket.binCounts[findResponseTimeBin(durationMs)] += 1;
}

function recordHttpRequestResult(statusCode, durationMs) {
  inc(`HTTP_${String(statusCode || 0)}`);
  observeResponseTime(durationMs);
}

/** Sum count buckets that overlap the rolling window ending at now. */
function sumCountWindow(store, now = Date.now()) {
  const windowStart = now - WINDOW_MS;
  let total = 0;

  for (const bucket of store.buckets) {
    if (bucket.bucketStart === 0 && bucket.count === 0) continue;
    const bucketEnd = bucket.bucketStart + BUCKET_MS;
    if (bucketEnd > windowStart && bucket.bucketStart < now) {
      total += bucket.count;
    }
  }

  return total;
}

/** Flat map key -> count in window (keys with 0 omitted). HTTP_<code>, JS_CLIENT_ERROR, ... */
function getWindowCounts(now = Date.now()) {
  const result = Object.create(null);
  for (const [key, store] of countStore.entries()) {
    const n = sumCountWindow(store, now);
    if (n > 0) result[key] = n;
  }
  return result;
}

function round1(value) {
  if (!Number.isFinite(value)) return undefined;
  return Number(value.toFixed(1));
}

function mergeActiveResponseTimeBuckets(now = Date.now()) {
  const windowStart = now - WINDOW_MS;
  const merged = {
    count: 0,
    sum: 0,
    min: Number.POSITIVE_INFINITY,
    max: 0,
    binCounts: Array.from({ length: RESPONSE_TIME_BOUNDS_MS.length + 1 }, () => 0),
  };

  for (const bucket of responseTimeStore.buckets) {
    if (!bucket.count) continue;
    const bucketEnd = bucket.bucketStart + BUCKET_MS;
    if (!(bucketEnd > windowStart && bucket.bucketStart < now)) continue;

    merged.count += bucket.count;
    merged.sum += bucket.sum;
    if (bucket.min < merged.min) merged.min = bucket.min;
    if (bucket.max > merged.max) merged.max = bucket.max;
    for (let i = 0; i < merged.binCounts.length; i += 1) {
      merged.binCounts[i] += bucket.binCounts[i];
    }
  }

  return merged;
}

function estimatePercentileFromHistogram(merged, percentile) {
  if (!merged.count) return undefined;
  const target = (percentile / 100) * merged.count;
  let cumulative = 0;

  for (let i = 0; i < merged.binCounts.length; i += 1) {
    const binCount = merged.binCounts[i];
    if (!binCount) continue;

    const nextCumulative = cumulative + binCount;
    if (target <= nextCumulative || i === merged.binCounts.length - 1) {
      const lower = i === 0 ? 0 : RESPONSE_TIME_BOUNDS_MS[i - 1];
      const upper =
        i < RESPONSE_TIME_BOUNDS_MS.length
          ? RESPONSE_TIME_BOUNDS_MS[i]
          : Math.max(merged.max, lower);
      if (upper <= lower) return upper;
      const ratio = Math.max(0, Math.min(1, (target - cumulative) / binCount));
      return lower + (upper - lower) * ratio;
    }

    cumulative = nextCumulative;
  }

  return merged.max;
}

function getWindowResponseTimeStats(now = Date.now()) {
  const merged = mergeActiveResponseTimeBuckets(now);
  if (!merged.count) return { count: 0 };

  return {
    count: merged.count,
    min: round1(merged.min),
    max: round1(merged.max),
    avg: round1(merged.sum / merged.count),
    p50: round1(estimatePercentileFromHistogram(merged, 50)),
    p90: round1(estimatePercentileFromHistogram(merged, 90)),
    p95: round1(estimatePercentileFromHistogram(merged, 95)),
    p99: round1(estimatePercentileFromHistogram(merged, 99)),
  };
}

module.exports = {
  JS_CLIENT_ERROR,
  inc,
  recordHttpRequestResult,
  getWindowCounts,
  getWindowResponseTimeStats,
};

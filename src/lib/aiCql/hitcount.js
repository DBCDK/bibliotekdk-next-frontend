/**
 * @file
 * Server-side hit count check against FBI-API complexSearch, used by AI
 * search v3.1 to validate a generated CQL query before it is handed to the
 * client.
 *
 * Configuration (server-side env):
 *   AI_CQL_VALIDATE                "false" disables validation (v3.1 behaves like v3)
 *   AI_CQL_FBI_API_URL             full GraphQL URL; default derived from
 *                                  NEXT_PUBLIC_FBI_API_BIBDK21_URL or the origin of
 *                                  NEXT_PUBLIC_FBI_API_URL + /<profile>/graphql
 *   FBI_API_FORCE_PROFILE          profile used in the derived URL (default bibdk21)
 *   AI_CQL_HITCOUNT_TIMEOUT_MS     per request, default 6000
 *   AI_CQL_HITCOUNT_CONCURRENCY    candidates checked in parallel, default 3
 *   AI_CQL_LLM_RETRIES             LLM revision rounds on 0 hits, default 1
 *   AI_CQL_MAX_RELAXATIONS         deterministic candidates tried on 0 hits, default 6
 *   AI_CQL_VALIDATE_BUDGET_MS      total time allowed for validation, default 12000
 */

const DEFAULTS = Object.freeze({
  profile: "bibdk21",
  timeoutMs: 6000,
  concurrency: 3,
  llmRetries: 1,
  maxRelaxations: 6,
  budgetMs: 12000,
});

const HITCOUNT_QUERY = `query AiCqlHitcount($cql: String!) {
  complexSearch(cql: $cql) {
    hitcount
    errorMessage
  }
}`;

function intOr(value, fallback) {
  const n = parseInt(value ?? "", 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/**
 * Resolves the FBI-API GraphQL endpoint used for hit counts.
 *
 * @param {Object} [env]
 * @returns {string|null}
 */
export function getFbiApiUrl(env = process.env) {
  if (env.AI_CQL_FBI_API_URL) {
    return env.AI_CQL_FBI_API_URL;
  }
  if (env.NEXT_PUBLIC_FBI_API_BIBDK21_URL) {
    return env.NEXT_PUBLIC_FBI_API_BIBDK21_URL;
  }
  if (!env.NEXT_PUBLIC_FBI_API_URL) {
    return null;
  }
  try {
    const origin = new URL(env.NEXT_PUBLIC_FBI_API_URL).origin;
    const profile = env.FBI_API_FORCE_PROFILE || DEFAULTS.profile;
    return `${origin}/${profile}/graphql`;
  } catch {
    return null;
  }
}

/**
 * Reads the validation configuration from the environment.
 *
 * @param {Object} [env]
 */
export function getValidationConfig(env = process.env) {
  return {
    enabled: env.AI_CQL_VALIDATE !== "false",
    url: getFbiApiUrl(env),
    timeoutMs: intOr(env.AI_CQL_HITCOUNT_TIMEOUT_MS, DEFAULTS.timeoutMs),
    concurrency: Math.max(
      1,
      intOr(env.AI_CQL_HITCOUNT_CONCURRENCY, DEFAULTS.concurrency)
    ),
    llmRetries: intOr(env.AI_CQL_LLM_RETRIES, DEFAULTS.llmRetries),
    maxRelaxations: intOr(env.AI_CQL_MAX_RELAXATIONS, DEFAULTS.maxRelaxations),
    budgetMs: intOr(env.AI_CQL_VALIDATE_BUDGET_MS, DEFAULTS.budgetMs),
  };
}

export class HitcountError extends Error {
  constructor(message, { status, body, timeout = false } = {}) {
    super(message);
    this.name = "HitcountError";
    this.status = status;
    this.body = body;
    this.timeout = timeout;
  }
}

/**
 * Asks FBI-API how many works a CQL query matches.
 *
 * Resolves with `hitcount: 0` and an `errorMessage` when FBI-API rejects the
 * CQL itself (syntax / unknown index): for validation purposes an invalid
 * query is simply a query without results. Network / HTTP / GraphQL errors
 * reject with HitcountError so the caller can decide to skip validation.
 *
 * @param {Object} params
 * @param {string} params.cql
 * @param {string} params.accessToken
 * @param {string} [params.url]
 * @param {number} [params.timeoutMs]
 * @param {Function} [params.fetchImpl]
 * @returns {Promise<{ hitcount: number, errorMessage: string|null, durationMs: number }>}
 */
export async function fetchHitcount({
  cql,
  accessToken,
  url = getFbiApiUrl(),
  timeoutMs = DEFAULTS.timeoutMs,
  fetchImpl = fetch,
}) {
  if (!url) {
    throw new HitcountError("FBI-API url is not configured");
  }
  if (!accessToken) {
    throw new HitcountError("No FBI-API access token");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();

  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: HITCOUNT_QUERY,
        variables: { cql },
      }),
      signal: controller.signal,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new HitcountError(`FBI-API responded ${res.status}`, {
        status: res.status,
        body: text?.slice(0, 500),
      });
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new HitcountError("FBI-API returned non-JSON body", {
        status: res.status,
        body: text?.slice(0, 500),
      });
    }

    const search = json?.data?.complexSearch;
    if (!search) {
      throw new HitcountError("FBI-API returned no complexSearch data", {
        status: res.status,
        body: JSON.stringify(json?.errors || json).slice(0, 500),
      });
    }

    const errorMessage = search.errorMessage || null;
    const hitcount = errorMessage
      ? 0
      : Math.max(0, parseInt(search.hitcount ?? 0, 10) || 0);

    return { hitcount, errorMessage, durationMs: Date.now() - start };
  } catch (err) {
    if (err instanceof HitcountError) {
      throw err;
    }
    if (err?.name === "AbortError") {
      throw new HitcountError("FBI-API hitcount request timed out", {
        timeout: true,
      });
    }
    throw new HitcountError(`FBI-API request failed: ${err?.message || err}`);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Checks an ordered list of candidates and returns the first one (in list
 * order) with hits. Candidates are checked in small parallel batches so the
 * common case (an early candidate matches) stays cheap.
 *
 * Every checked candidate gets its `hitcount` (and `errorMessage`) filled in
 * and is appended to `attempts`; unchecked candidates are left alone.
 *
 * @param {Array<{ cql: string }>} candidates
 * @param {Object} options
 * @param {Function} options.check  async (cql) => { hitcount, errorMessage }
 * @param {number} [options.concurrency]
 * @param {Function} [options.hasTime] returns false when the budget is spent
 * @param {Array} [options.attempts]
 * @returns {Promise<Object|null>} the winning candidate or null
 */
export async function firstWithHits(
  candidates,
  { check, concurrency = DEFAULTS.concurrency, hasTime = () => true, attempts }
) {
  for (let i = 0; i < candidates.length; i += concurrency) {
    if (!hasTime()) {
      return null;
    }
    const batch = candidates.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (candidate) => {
        const r = await check(candidate.cql);
        candidate.hitcount = r.hitcount;
        if (r.errorMessage) {
          candidate.errorMessage = r.errorMessage;
        }
        attempts?.push(candidate);
        return candidate;
      })
    );
    const winner = results.find((c) => c.hitcount > 0);
    if (winner) {
      return winner;
    }
  }
  return null;
}

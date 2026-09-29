/**
 * Catalogue values from facets for AI search v7.
 *
 * Every value in a field with a matching FBI-API facet is searched on its own
 * in the default index (term.default="value"), so one broad value cannot
 * drown out the others. The top FACET_LIMIT facet values of the clause's
 * field are reranked against the value with voyageai/rerank-2.5-lite, and the
 * best one replaces the model's value when it scores at least minScore.
 *
 * A value is kept as written when there are no facet values, the best score
 * is too low, or FBI-API / the reranker fails; the lookup never fails the
 * request.
 *
 * Configuration (server-side env):
 *   AI_CQL_FACET_MIN_SCORE   reranker score needed to replace a value, default 0.5
 */

import { quote, sanitizeText } from "@/lib/aiCql/compiler";

const FACET_LIMIT = 20;
const RERANK_TOP_N = 3;
const DEFAULT_MIN_SCORE = 0.5;
const DEFAULT_TIMEOUT_MS = 4000;

const FACETS_QUERY = `query AiCqlV7Facets($cql: String!, $facets: ComplexSearchFacetsInput) {
  complexFacets(cql: $cql, facets: $facets) {
    facets {
      values {
        key
      }
    }
  }
}`;

/** field name → ComplexSearchFacetsEnum */
export const FACET_TYPES = Object.freeze({
  creatorcontributor: "CREATORCONTRIBUTOR",
  function: "CREATORCONTRIBUTORFUNCTION",
  subject: "SUBJECT",
  series: "SERIES",
  hostpublication: "HOSTPUBLICATION",
  fictionalcharacter: "FICTIONALCHARACTER",
});

export function getFacetConfig(env = process.env) {
  const minScore = parseFloat(env.AI_CQL_FACET_MIN_SCORE ?? "");
  return {
    minScore: Number.isFinite(minScore) ? minScore : DEFAULT_MIN_SCORE,
  };
}

/**
 * Top facet values of one field for a default-index search on one value.
 * Never throws: any problem resolves to an empty list.
 *
 * @returns {Promise<string[]>}
 */
export async function fetchFacetValues({
  q,
  facet,
  accessToken,
  url,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  fetchImpl = fetch,
}) {
  const term = sanitizeText(q);
  if (!url || !accessToken || !term) {
    return [];
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: FACETS_QUERY,
        variables: {
          cql: `term.default=${quote(term)}`,
          facets: { facetLimit: FACET_LIMIT, facets: [facet] },
        },
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      return [];
    }
    const json = JSON.parse(await res.text());
    return (json?.data?.complexFacets?.facets?.[0]?.values || [])
      .map((value) => value?.key)
      .filter((key) => typeof key === "string" && key.trim())
      .map((key) => key.trim());
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Reranks facet values against the value from the model.
 * Never throws: any problem resolves to an empty list.
 *
 * @returns {Promise<Array<{ value: string, score: number }>>} best first
 */
export async function rankFacetValues({
  query,
  documents,
  config,
  fetchImpl = fetch,
}) {
  if (!config?.apiKey || !query || !documents.length) {
    return [];
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      "X-Title": config.title,
    };
    if (config.referer) {
      headers["HTTP-Referer"] = config.referer;
    }

    const response = await fetchImpl(`${config.baseUrl}/rerank`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        query,
        documents,
        top_n: Math.min(RERANK_TOP_N, documents.length),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return [];
    }

    const json = JSON.parse(await response.text());
    return (json?.results || [])
      .map((result) => ({
        value: documents[result?.index],
        score: Number(result?.relevance_score),
      }))
      .filter((r) => typeof r.value === "string" && Number.isFinite(r.score));
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Replaces every value in a facet field with its best reranked facet value.
 * Clauses on other fields are untouched. Lookups run in parallel and
 * identical (facet, value) pairs are only looked up once.
 *
 * @returns {Promise<{ ast: Object, resolutions: Array, facets: Array }>}
 */
export async function resolveWithFacets(
  ast,
  {
    accessToken,
    url,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    fetchImpl,
    rerankConfig,
    minScore = DEFAULT_MIN_SCORE,
    facetsImpl = fetchFacetValues,
    rankImpl = rankFacetValues,
  } = {}
) {
  const resolutions = [];
  const facets = [];

  if (!Array.isArray(ast?.clauses)) {
    return { ast, resolutions, facets };
  }

  const cache = new Map();
  const lookup = (facet, q) => {
    const key = `${facet} ${q.toLowerCase()}`;
    if (!cache.has(key)) {
      cache.set(
        key,
        (async () => {
          const documents = await facetsImpl({
            q,
            facet,
            accessToken,
            url,
            timeoutMs,
            fetchImpl,
          });
          return rankImpl({
            query: q,
            documents,
            config: rerankConfig,
            fetchImpl,
          });
        })()
      );
    }
    return cache.get(key);
  };

  const clauses = await Promise.all(
    ast.clauses.map(async (clause) => {
      const facet = FACET_TYPES[clause?.field];
      if (!facet || !Array.isArray(clause.values)) {
        return clause;
      }
      const values = await Promise.all(
        clause.values.map(async (raw) => {
          const input = String(raw ?? "").trim();
          if (!input) {
            return raw;
          }
          const candidates = await lookup(facet, input);
          const best = candidates[0];
          const accepted = best && best.score >= minScore ? best.value : null;
          facets.push({
            field: clause.field,
            facet,
            input,
            candidates,
            accepted,
          });
          if (!accepted || accepted.toLowerCase() === input.toLowerCase()) {
            return input;
          }
          resolutions.push({
            field: clause.field,
            input,
            value: accepted,
            method: "facet",
          });
          return accepted;
        })
      );
      return { ...clause, values };
    })
  );

  return { ast: { ...ast, clauses }, resolutions, facets };
}

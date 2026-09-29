/**
 * API route: natural language → CQL, v7.
 *
 * Same LLM step as v4, but catalogue values come from facets instead of the
 * suggester: every value in a facet field is searched on its own in the
 * default index, and the reranked top facet value of the clause's field
 * replaces it (src/lib/aiCql/v7/facets.js). Fields without a facet (title,
 * publisher) use the v4.1 reranked suggester. Both run in parallel.
 *
 * Extra response field:
 *   facets  every facet lookup: { field, facet, input, candidates, accepted }
 */

/* eslint-disable no-console */

import { compile, fallbackCql } from "@/lib/aiCql/compiler";
import { OpenRouterError } from "@/lib/aiCql/openrouter";
import { FIELDS, FIELD_ALIASES } from "@/lib/aiCql/v4/indexes";
import { getConfig } from "@/lib/aiCql/v4/provider";
import { resolveWithSuggester } from "@/lib/aiCql/v4/suggest";
import {
  createRerankedSuggestImpl,
  getRerankConfig,
  getSuggestConfig,
} from "@/lib/aiCql/v4.1/suggest";
import {
  FACET_TYPES,
  getFacetConfig,
  resolveWithFacets,
} from "@/lib/aiCql/v7/facets";
import { translate as translateV4 } from "@/pages/api/ai/v4/cql";
import { getAccessToken } from "@/pages/api/ai/v3.1/cql";

const MAX_PROMPT_LENGTH = 1000;
const LOG_PREFIX = "ai/v7/cql";

const COMPILE_OPTIONS = { fields: FIELDS, fieldAliases: FIELD_ALIASES };

function getOpenRouterErrorMessage(err) {
  try {
    const body = JSON.parse(err.body);
    return body?.error?.message || body?.message || err.message;
  } catch {
    return err.message;
  }
}

async function timed(promise) {
  const started = Date.now();
  const result = await promise;
  return [result, Date.now() - started];
}

export async function translate(
  prompt,
  {
    config,
    suggest,
    accessToken,
    fetchImpl,
    suggestImpl,
    rerankImpl,
    rerankConfig,
    facetConfig,
    facetsImpl,
    rankFacetsImpl,
  } = {}
) {
  const cfg = config || getConfig();
  const sug = suggest || getSuggestConfig();
  const rrCfg = rerankConfig || getRerankConfig(process.env, cfg);
  const base = await translateV4(prompt, {
    config: cfg,
    suggest: { ...sug, enabled: false },
    fetchImpl,
  });

  const originalAst = base.originalAst;
  if (
    !sug.enabled ||
    !sug.url ||
    !accessToken ||
    !Array.isArray(originalAst?.clauses)
  ) {
    return { ...base, facets: [] };
  }

  const options = {
    accessToken,
    url: sug.url,
    timeoutMs: sug.timeoutMs,
    fetchImpl,
  };
  const [[faceted, facetMs], [suggested, suggestMs]] = await Promise.all([
    timed(
      resolveWithFacets(originalAst, {
        ...options,
        rerankConfig: rrCfg,
        minScore: (facetConfig || getFacetConfig()).minScore,
        facetsImpl,
        rankImpl: rankFacetsImpl,
      })
    ),
    timed(
      resolveWithSuggester(
        {
          ...originalAst,
          clauses: originalAst.clauses.map((c) =>
            FACET_TYPES[c?.field] ? null : c
          ),
        },
        {
          ...options,
          suggestImpl: createRerankedSuggestImpl({
            config: rrCfg,
            suggestImpl,
            rerankImpl,
          }),
        }
      )
    ),
  ]);

  const ast = {
    ...originalAst,
    clauses: originalAst.clauses.map((c, i) =>
      FACET_TYPES[c?.field] ? faceted.ast.clauses[i] : suggested.ast.clauses[i]
    ),
  };
  const compiled = compile(ast, COMPILE_OPTIONS);
  const resolveMs = Math.max(facetMs, suggestMs);

  return {
    ...base,
    cql: compiled.cql || fallbackCql(prompt),
    ast,
    resolutions: [
      ...faceted.resolutions,
      ...suggested.resolutions,
      ...compiled.resolutions,
    ],
    suggestions: suggested.suggestions,
    facets: faceted.facets,
    warnings: compiled.warnings,
    fallback: !compiled.cql,
    timing: {
      ...base.timing,
      suggest: suggestMs,
      facets: facetMs,
      total: base.timing.total + resolveMs,
    },
  };
}

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = getConfig();
  if (!config.apiKey) {
    console.error(`${LOG_PREFIX}: LLM provider token is not configured`);
    return res.status(500).json({ error: "AI search is not configured" });
  }

  const prompt =
    typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: "Prompt too long" });
  }

  res.setHeader("Cache-Control", "no-store");

  const suggest = getSuggestConfig();
  const accessToken = suggest.enabled ? await getAccessToken(req, res) : null;

  try {
    const result = await translate(prompt, { config, suggest, accessToken });

    if (!result.cql) {
      console.error(`${LOG_PREFIX}: no CQL could be produced`, { prompt });
      return res.status(502).json({ error: "Could not generate CQL" });
    }

    console.log(`${LOG_PREFIX}: translated`, {
      model: result.model,
      reranker: "voyageai/rerank-2.5-lite",
      fallback: result.fallback,
      facets: result.facets.length,
      suggestions: result.suggestions.length,
      corrected: result.resolutions.filter(
        (r) => r.method === "facet" || r.method === "suggester"
      ).length,
      warnings: result.warnings.length,
      llmMs: result.timing.llm,
      facetsMs: result.timing.facets ?? 0,
      suggestMs: result.timing.suggest,
      totalMs: result.timing.total,
      cachedTokens: result.usage?.cachedTokens ?? null,
      promptTokens: result.usage?.promptTokens ?? null,
    });

    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof OpenRouterError) {
      console.error(`${LOG_PREFIX}: LLM request failed`, {
        error: err.message,
        status: err.status,
        body: err.body,
        timeout: err.timeout,
      });
      return res.status(err.timeout ? 504 : 502).json({
        error: err.timeout
          ? "AI service timeout"
          : getOpenRouterErrorMessage(err),
      });
    }
    console.error(`${LOG_PREFIX}: request error`, {
      error: String(err?.message || err),
    });
    return res.status(502).json({ error: "AI request failed" });
  }
}

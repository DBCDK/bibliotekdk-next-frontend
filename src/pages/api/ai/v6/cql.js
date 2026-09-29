/**
 * API route: natural language → CQL, v6.
 *
 * Identical to v4.1, followed by a relaxation loop: when the query has 0 hits
 * in FBI-API, the clauses are ranked once against the prompt with
 * voyageai/rerank-2.5-lite and the least relevant ones are dropped until a
 * query has hits (src/lib/aiCql/v6/relax.js). All relaxed candidates are
 * checked in one parallel batch; the least relaxed one with hits wins.
 *
 * Extra response field:
 *   relaxation  { applied, ranking, attempts: [{ strategy, cql, hitcount }] }
 *               applied is the winning strategy, or null when the v4.1 query
 *               was kept.
 */

/* eslint-disable no-console */

import {
  fetchHitcount,
  firstWithHits,
  getValidationConfig,
} from "@/lib/aiCql/hitcount";
import { OpenRouterError } from "@/lib/aiCql/openrouter";
import { getConfig } from "@/lib/aiCql/v4/provider";
import { getRerankConfig, getSuggestConfig } from "@/lib/aiCql/v4.1/suggest";
import {
  positiveClauses,
  rankClauses,
  relaxCandidates,
} from "@/lib/aiCql/v6/relax";
import { translate as translateV41 } from "@/pages/api/ai/v4.1/cql";
import { getAccessToken } from "@/pages/api/ai/v3.1/cql";

const MAX_PROMPT_LENGTH = 1000;
const LOG_PREFIX = "ai/v6/cql";

function getOpenRouterErrorMessage(err) {
  try {
    const body = JSON.parse(err.body);
    return body?.error?.message || body?.message || err.message;
  } catch {
    return err.message;
  }
}

function toAttempt({ strategy, cql, hitcount, errorMessage }) {
  return errorMessage
    ? { strategy, cql, hitcount, errorMessage }
    : { strategy, cql, hitcount };
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
    validation,
    hitcountImpl = fetchHitcount,
    rankClausesImpl = rankClauses,
  } = {}
) {
  const cfg = config || getConfig();
  const rrCfg = rerankConfig || getRerankConfig(process.env, cfg);
  const result = await translateV41(prompt, {
    config: cfg,
    suggest,
    accessToken,
    fetchImpl,
    suggestImpl,
    rerankImpl,
    rerankConfig: rrCfg,
  });

  const val = validation || getValidationConfig();
  const relaxation = { applied: null, ranking: null, attempts: [] };
  if (!val.enabled || !val.url || !accessToken || !result.ast) {
    return { ...result, relaxation };
  }

  const started = Date.now();
  const check = (cql) =>
    hitcountImpl({
      cql,
      accessToken,
      url: val.url,
      timeoutMs: val.timeoutMs,
      fetchImpl,
    });
  const warnings = [...result.warnings];
  let winner = null;

  try {
    const first = await check(result.cql);
    relaxation.attempts.push(
      toAttempt({ strategy: "original", cql: result.cql, ...first })
    );

    if (first.hitcount === 0) {
      const { order, method } = await rankClausesImpl({
        query: prompt,
        clauses: positiveClauses(result.ast),
        config: rrCfg,
        fetchImpl,
      });
      relaxation.ranking = method;

      const attempts = [];
      winner = await firstWithHits(
        relaxCandidates(result.ast, order, { exclude: [result.cql] }),
        {
          check,
          concurrency: val.concurrency,
          hasTime: () => Date.now() - started < val.budgetMs,
          attempts,
        }
      );
      relaxation.attempts.push(...attempts.map(toAttempt));
      relaxation.applied = winner?.strategy ?? null;
      if (!winner) {
        warnings.push("No relaxed query had hits");
      }
    }
  } catch (err) {
    warnings.push(`Hit count check skipped: ${err?.message || err}`);
  }

  const relaxMs = Date.now() - started;
  return {
    ...result,
    cql: winner?.cql ?? result.cql,
    ast: winner?.ast ?? result.ast,
    warnings,
    relaxation,
    timing: {
      ...result.timing,
      relax: relaxMs,
      total: result.timing.total + relaxMs,
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
  const validation = getValidationConfig();
  const accessToken =
    suggest.enabled || validation.enabled
      ? await getAccessToken(req, res)
      : null;

  try {
    const result = await translate(prompt, {
      config,
      suggest,
      accessToken,
      validation,
    });

    if (!result.cql) {
      console.error(`${LOG_PREFIX}: no CQL could be produced`, { prompt });
      return res.status(502).json({ error: "Could not generate CQL" });
    }

    console.log(`${LOG_PREFIX}: translated`, {
      model: result.model,
      reranker: "voyageai/rerank-2.5-lite",
      fallback: result.fallback,
      suggestions: result.suggestions.length,
      corrected: result.resolutions.filter((r) => r.method === "suggester")
        .length,
      relaxed: result.relaxation.applied,
      ranking: result.relaxation.ranking,
      hitcountChecks: result.relaxation.attempts.length,
      warnings: result.warnings.length,
      llmMs: result.timing.llm,
      suggestMs: result.timing.suggest,
      relaxMs: result.timing.relax ?? 0,
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

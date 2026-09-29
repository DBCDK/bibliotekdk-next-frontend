/**
 * @file
 * API route: natural language → CQL, v5.
 *
 *  1. **LLM → 3 ASTs.** One structured-output call to a small model returns
 *     three candidate ASTs (src/lib/aiCql/v5/prompt.js).
 *  2. **ASTs → CQL.** Each candidate is compiled with the v4 registry; empty
 *     and duplicate queries are dropped. No catalogue lookup.
 *  3. **Rerank.** The CQL strings are reranked against the prompt with the
 *     v4.1 reranker (voyageai/rerank-2.5-lite). The top one is returned; on
 *     reranker failure the model's first candidate wins.
 *
 * Response:
 *   cql          the query to search with
 *   ast          the AST behind cql
 *   candidates   [{ ast, cql, rank }] in reranked order
 *   note         one short Danish sentence from the model, or null
 *   resolutions  vocabulary matches for the chosen candidate
 *   warnings     compiler warnings for the chosen candidate
 *   fallback     true when the whole prompt was used as a default-index term
 *   model, mode, usage, timing { llm, rerank, total }
 */

/* eslint-disable no-console */

import { compile, fallbackCql } from "@/lib/aiCql/compiler";
import {
  chatCompletion,
  extractToolArguments,
  extractUsage,
  OpenRouterError,
} from "@/lib/aiCql/openrouter";
import { FIELDS, FIELD_ALIASES } from "@/lib/aiCql/v4/indexes";
import { getConfig as getV4Config } from "@/lib/aiCql/v4/provider";
import { buildMessages } from "@/lib/aiCql/v4/prompt";
import {
  buildResponseFormat,
  buildSystemPrompt,
  CANDIDATE_COUNT,
} from "@/lib/aiCql/v5/prompt";
import { getRerankConfig, rerankSuggestions } from "@/lib/aiCql/v4.1/suggest";

const MODEL = "google/gemma-4-26b-a4b-it";
const MAX_TOKENS = 1500;
const MAX_PROMPT_LENGTH = 1000;
const LOG_PREFIX = "ai/v5/cql";

const SYSTEM_PROMPT = buildSystemPrompt();
const RESPONSE_FORMAT = buildResponseFormat();

const COMPILE_OPTIONS = { fields: FIELDS, fieldAliases: FIELD_ALIASES };

export function getConfig(env = process.env) {
  return { ...getV4Config(env), model: MODEL, fallbackModels: [] };
}

function debug(step, data = {}) {
  if (process.env.AI_CQL_DEBUG === "true") {
    console.log(`[${LOG_PREFIX}] ${step}`, data);
  }
}

function getOpenRouterErrorMessage(err) {
  try {
    const body = JSON.parse(err.body);
    return body?.error?.message || body?.message || err.message;
  } catch {
    return err.message;
  }
}

/**
 * Step 1: prompt → candidate ASTs.
 */
async function toCandidates(prompt, { cfg, fetchImpl }) {
  const messages = buildMessages(prompt, { systemPrompt: SYSTEM_PROMPT });
  debug("llm-call:start", { prompt, model: cfg.model });

  const { json, durationMs } = await chatCompletion({
    messages,
    responseFormat: RESPONSE_FORMAT,
    maxTokens: MAX_TOKENS,
    config: cfg,
    fetchImpl,
  });
  const output = extractToolArguments(json);
  const asts = (Array.isArray(output?.candidates) ? output.candidates : [])
    .filter((ast) => ast && typeof ast === "object")
    .slice(0, CANDIDATE_COUNT);

  debug("llm-call:output", { asts, durationMs });

  return {
    asts,
    model: json?.model || cfg.model,
    usage: extractUsage(json),
    llmMs: durationMs,
  };
}

/**
 * Runs the whole v5 pipeline for a prompt. Exported for tests / scripts.
 *
 * @param {string} prompt
 * @param {Object} [options]
 * @param {Object} [options.config] LLM provider config override
 * @param {Object} [options.rerankConfig] result of getRerankConfig()
 * @param {Function} [options.fetchImpl] fetch used for the LLM
 * @param {Function} [options.rerankImpl] replaces rerankSuggestions (tests)
 * @returns {Promise<Object>} response body
 */
export async function translate(
  prompt,
  { config, rerankConfig, fetchImpl, rerankImpl = rerankSuggestions } = {}
) {
  const started = Date.now();
  const cfg = config || getConfig();
  debug("pipeline:start", { prompt, model: cfg.model });

  // 1. prompt → ASTs
  const base = await toCandidates(prompt, { cfg, fetchImpl });

  // 2. ASTs → CQL
  const byCql = new Map();
  for (const ast of base.asts) {
    const compiled = compile(ast, COMPILE_OPTIONS);
    if (compiled.cql && !byCql.has(compiled.cql)) {
      byCql.set(compiled.cql, { ast, compiled });
    }
  }

  // 3. rerank
  const rerankStarted = Date.now();
  const ranked = await rerankImpl({
    query: prompt,
    documents: [...byCql.keys()],
    config: rerankConfig || getRerankConfig(process.env, cfg),
    fetchImpl,
  });
  const rerankMs = Date.now() - rerankStarted;
  debug("rerank:done", { ranked, rerankMs });

  const candidates = ranked.map((cql, index) => ({
    ast: byCql.get(cql).ast,
    cql,
    rank: index + 1,
  }));
  const best = byCql.get(ranked[0]);

  const warnings = best ? [...best.compiled.warnings] : [];
  if (!base.asts.length) {
    warnings.push("Model returned no usable candidates");
  }

  let cql = best?.compiled.cql ?? null;
  let fallback = false;
  if (!cql) {
    cql = fallbackCql(prompt);
    fallback = true;
  }

  const result = {
    cql,
    ast: best?.ast || null,
    candidates,
    note:
      typeof best?.ast?.note === "string" ? best.ast.note.slice(0, 200) : null,
    resolutions: best?.compiled.resolutions || [],
    warnings,
    fallback,
    model: base.model,
    mode: "json",
    usage: base.usage,
    timing: {
      llm: base.llmMs,
      rerank: rerankMs,
      total: Date.now() - started,
    },
  };
  debug("pipeline:finish", result);
  return result;
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

  try {
    const result = await translate(prompt, { config });

    if (!result.cql) {
      console.error(`${LOG_PREFIX}: no CQL could be produced`, { prompt });
      return res.status(502).json({ error: "Could not generate CQL" });
    }

    console.log(`${LOG_PREFIX}: translated`, {
      model: result.model,
      reranker: "voyageai/rerank-2.5-lite",
      fallback: result.fallback,
      candidates: result.candidates.length,
      warnings: result.warnings.length,
      llmMs: result.timing.llm,
      rerankMs: result.timing.rerank,
      totalMs: result.timing.total,
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

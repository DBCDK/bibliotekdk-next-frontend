/**
 * @file
 * API route: natural language → CQL, v4.
 *
 * Three deterministic steps, no hit count check and no relaxation loop:
 *
 *  1. **LLM → AST.** One forced tool call turns the prompt into the small JSON
 *     AST (src/lib/aiCql/v4/prompt.js). The field registry is narrower than in
 *     v3: every person is `creatorcontributor`, and `issn`/`dk5` are gone
 *     (src/lib/aiCql/v4/indexes.js).
 *  2. **AST → catalogue values.** Every value in an open-vocabulary field
 *     (creatorcontributor, subject, title, series, publisher, hostpublication,
 *     fictionalcharacter, function) is sent to FBI-API's `complexSuggest` and
 *     replaced by the FIRST suggestion (src/lib/aiCql/v4/suggest.js). Values
 *     the suggester does not know are kept as written.
 *  3. **AST → CQL.** The shared deterministic compiler, with the v4 registry.
 *
 * Because step 2 only ever puts terms in the query that exist in the
 * catalogue, v4 does not verify the hit count: the query is handed to the
 * normal CQL search straight away.
 *
 * Response:
 *   cql          the query to search with
 *   ast          the AST after the suggester step
 *   originalAst  the AST as the model produced it
 *   original     { cql } compiled from originalAst (null when it had none)
 *   note         one short Danish sentence from the model, or null
 *   resolutions  value changes: vocabulary matches + { method: "suggester" }
 *   suggestions  every suggester lookup: { field, type, input, suggestions, accepted }
 *   warnings     compiler warnings
 *   fallback     true when the whole prompt was used as a default-index term
 *   model, mode, usage, timing { llm, suggest, total }
 *
 * Skip the catalogue step with AI_CQL_SUGGEST=false (then v4 is v3 with the
 * narrow registry).
 */

/* eslint-disable no-console */

import { compile, fallbackCql } from "@/lib/aiCql/compiler";
import {
  chatCompletion,
  extractToolArguments,
  extractUsage,
  getConfig,
  OpenRouterError,
} from "@/lib/aiCql/openrouter";
import { FIELDS, FIELD_ALIASES } from "@/lib/aiCql/v4/indexes";
import {
  buildMessages,
  buildSystemPrompt,
  buildTool,
  TOOL_NAME,
} from "@/lib/aiCql/v4/prompt";
import { getSuggestConfig, resolveWithSuggester } from "@/lib/aiCql/v4/suggest";
import { getAccessToken } from "@/pages/api/ai/v3.1/cql";

const MAX_PROMPT_LENGTH = 1000;
const LOG_PREFIX = "ai/v4/cql";

// Built once per server process – this is the cacheable static prefix.
const SYSTEM_PROMPT = buildSystemPrompt();
const TOOL = buildTool();

const COMPILE_OPTIONS = { fields: FIELDS, fieldAliases: FIELD_ALIASES };

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
 * One chat completion in "tool" mode, falling back to plain JSON output when
 * OpenRouter has no tool-capable endpoint for the model.
 *
 * @returns {Promise<{ json: Object, durationMs: number, mode: string }>}
 */
export async function callModel({ messages, cfg, fetchImpl }) {
  try {
    const r = await chatCompletion({
      messages,
      tools: [TOOL],
      toolChoice: { type: "function", function: { name: TOOL_NAME } },
      config: cfg,
      fetchImpl,
    });
    return { ...r, mode: "tool" };
  } catch (err) {
    if (!(err instanceof OpenRouterError) || !err.isRoutingError) {
      throw err;
    }
    console.warn(
      `${LOG_PREFIX}: no tool-capable endpoint, retrying with JSON output`,
      { model: cfg.model }
    );
  }

  const r = await chatCompletion({
    messages: [
      ...messages,
      {
        role: "system",
        content: `Tools are unavailable. Reply with ONLY the JSON object you would have passed to ${TOOL_NAME} (keys: clauses, combine, note). No prose, no markdown.`,
      },
    ],
    responseFormat: { type: "json_object" },
    config: cfg,
    fetchImpl,
  });
  return { ...r, mode: "json" };
}

/**
 * Step 1: prompt → AST.
 *
 * @returns {Promise<Object>}
 */
async function toAst(prompt, { cfg, fetchImpl }) {
  const messages = buildMessages(prompt, { systemPrompt: SYSTEM_PROMPT });
  debug("llm-call:start", { prompt, model: cfg.model });

  const { json, durationMs, mode } = await callModel({
    messages,
    cfg,
    fetchImpl,
  });
  const ast = extractToolArguments(json, TOOL_NAME) || null;

  debug("llm-call:output", { ast, durationMs, mode });

  return {
    ast,
    note: typeof ast?.note === "string" ? ast.note.slice(0, 200) : null,
    model: json?.model || cfg.model,
    mode,
    usage: extractUsage(json),
    llmMs: durationMs,
  };
}

/**
 * Runs the whole v4 pipeline for a prompt. Exported for tests / scripts.
 *
 * @param {string} prompt
 * @param {Object} [options]
 * @param {Object} [options.config] OpenRouter config override
 * @param {Object} [options.suggest] result of getSuggestConfig()
 * @param {string} [options.accessToken] FBI-API bearer token (no lookup without it)
 * @param {Function} [options.fetchImpl] fetch used for the LLM
 * @param {Function} [options.suggestImpl] replaces fetchSuggestions (tests)
 * @returns {Promise<Object>} response body
 */
export async function translate(
  prompt,
  { config, suggest, accessToken, fetchImpl, suggestImpl } = {}
) {
  const started = Date.now();
  const cfg = config || getConfig();
  const sug = suggest || getSuggestConfig();
  debug("pipeline:start", {
    prompt,
    model: cfg.model,
    suggestEnabled: sug.enabled,
  });

  // 1. prompt → AST
  const base = await toAst(prompt, { cfg, fetchImpl });
  const originalAst = base.ast;
  const originalCompiled = originalAst
    ? compile(originalAst, COMPILE_OPTIONS)
    : null;

  // 2. AST → catalogue values
  let ast = originalAst;
  let suggestions = [];
  let suggesterResolutions = [];
  let suggestMs = 0;
  const skipReason = !sug.enabled
    ? "Catalogue lookup is disabled"
    : !originalAst
    ? "No AST to look up"
    : !accessToken
    ? "No FBI-API access token"
    : !sug.url
    ? "FBI-API url is not configured"
    : null;

  if (!skipReason) {
    const suggestStarted = Date.now();
    const resolved = await resolveWithSuggester(originalAst, {
      accessToken,
      url: sug.url,
      timeoutMs: sug.timeoutMs,
      fetchImpl,
      suggestImpl,
    });
    suggestMs = Date.now() - suggestStarted;
    ast = resolved.ast;
    suggestions = resolved.suggestions;
    suggesterResolutions = resolved.resolutions;
    debug("suggester:done", { suggestions, resolutions: suggesterResolutions });
  } else {
    debug("suggester:skipped", { reason: skipReason });
  }

  // 3. AST → CQL
  let compiled = { cql: null, warnings: [], resolutions: [], clauses: [] };
  if (ast) {
    compiled = compile(ast, COMPILE_OPTIONS);
  } else {
    compiled.warnings.push("Model returned no usable tool call");
  }

  let fallback = false;
  let cql = compiled.cql;
  if (!cql) {
    cql = fallbackCql(prompt);
    fallback = true;
  }

  const result = {
    cql,
    ast: ast || null,
    originalAst: originalAst || null,
    original: { cql: originalCompiled?.cql ?? null },
    note: base.note,
    resolutions: [...suggesterResolutions, ...compiled.resolutions],
    suggestions,
    warnings: [
      ...compiled.warnings,
      ...(skipReason && sug.enabled && originalAst ? [skipReason] : []),
    ],
    fallback,
    model: base.model,
    mode: base.mode,
    usage: base.usage,
    timing: {
      llm: base.llmMs,
      suggest: suggestMs,
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
    console.error(`${LOG_PREFIX}: OPENROUTER_API_KEY is not configured`);
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
      fallback: result.fallback,
      suggestions: result.suggestions.length,
      corrected: result.resolutions.filter((r) => r.method === "suggester")
        .length,
      warnings: result.warnings.length,
      llmMs: result.timing.llm,
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

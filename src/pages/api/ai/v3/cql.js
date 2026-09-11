/**
 * @file
 * API route: natural language → CQL, v3.
 *
 * Differences from /api/ai/cql (v1):
 *  - The LLM returns a small JSON AST via a forced tool call instead of raw
 *    CQL; a deterministic compiler (src/lib/aiCql/compiler.js) produces the
 *    CQL, so syntax errors, unknown indexes and illegal operators are
 *    impossible by construction.
 *  - Controlled values (genre, material type, language …) are resolved against
 *    a local vocabulary (src/lib/aiCql/vocab.json) with alias/inflection/fuzzy
 *    matching – no second LLM round trip.
 *  - The LLM is called through OpenRouter (OPENROUTER_API_KEY) with a static,
 *    cacheable system prompt.
 *
 * Response: { cql, ast, note, resolutions, warnings, fallback, model, mode, timing, usage }
 * `mode` is "tool" (forced tool call) or "json" (plain JSON content, used when
 * no provider for the model supports tool calls).
 * `cql` keeps the v1 contract; the rest is metadata for debugging/UI.
 */

import { log } from "dbc-node-logger";

import { compile, fallbackCql } from "@/lib/aiCql/compiler";
import {
  buildMessages,
  buildSystemPrompt,
  buildTool,
  TOOL_NAME,
} from "@/lib/aiCql/prompt";
import {
  chatCompletion,
  extractToolArguments,
  extractUsage,
  getConfig,
  OpenRouterError,
} from "@/lib/aiCql/openrouter";

const MAX_PROMPT_LENGTH = 1000;

// Built once per server process – this is the cacheable static prefix.
const SYSTEM_PROMPT = buildSystemPrompt();
const TOOL = buildTool();

/**
 * Runs the whole translation for a prompt. Exported for tests / scripts.
 *
 * @param {string} prompt
 * @param {Object} [options]
 * @param {Object} [options.config] OpenRouter config override
 * @param {Function} [options.fetchImpl]
 * @returns {Promise<Object>} response body
 */
export async function translate(prompt, { config, fetchImpl } = {}) {
  const started = Date.now();
  const cfg = config || getConfig();

  const messages = buildMessages(prompt, { systemPrompt: SYSTEM_PROMPT });
  let mode = "tool";
  let json;
  let durationMs;

  try {
    ({ json, durationMs } = await chatCompletion({
      messages,
      tools: [TOOL],
      toolChoice: { type: "function", function: { name: TOOL_NAME } },
      config: cfg,
      fetchImpl,
    }));
  } catch (err) {
    if (!(err instanceof OpenRouterError) || !err.isRoutingError) {
      throw err;
    }
    // No provider for this model supports (forced) tool calls: ask for the
    // same JSON as plain content instead. The prompt describes the shape.
    log.warn("ai/v3/cql: no tool-capable endpoint, retrying with JSON output", {
      model: cfg.model,
    });
    mode = "json";
    ({ json, durationMs } = await chatCompletion({
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
    }));
  }

  const ast = extractToolArguments(json, TOOL_NAME);
  const usage = extractUsage(json);
  const model = json?.model || cfg.model;

  let compiled = { cql: null, warnings: [], resolutions: [], clauses: [] };
  if (ast) {
    compiled = compile(ast);
  } else {
    compiled.warnings.push("Model returned no usable tool call");
  }

  let fallback = false;
  let cql = compiled.cql;
  if (!cql) {
    cql = fallbackCql(prompt);
    fallback = true;
  }

  return {
    cql,
    ast: ast || null,
    note: typeof ast?.note === "string" ? ast.note.slice(0, 200) : null,
    resolutions: compiled.resolutions,
    warnings: compiled.warnings,
    fallback,
    model,
    mode,
    usage,
    timing: { llm: durationMs, total: Date.now() - started },
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
    log.error("ai/v3/cql: OPENROUTER_API_KEY is not configured");
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
      log.error("ai/v3/cql: no CQL could be produced", { prompt });
      return res.status(502).json({ error: "Could not generate CQL" });
    }

    log.info("ai/v3/cql: translated", {
      model: result.model,
      fallback: result.fallback,
      warnings: result.warnings.length,
      llmMs: result.timing.llm,
      totalMs: result.timing.total,
      cachedTokens: result.usage?.cachedTokens ?? null,
      promptTokens: result.usage?.promptTokens ?? null,
    });

    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof OpenRouterError) {
      log.error("ai/v3/cql: LLM request failed", {
        error: err.message,
        status: err.status,
        body: err.body,
        timeout: err.timeout,
      });
      return res.status(err.timeout ? 504 : 502).json({
        error: err.timeout ? "AI service timeout" : "AI service unavailable",
      });
    }
    log.error("ai/v3/cql: request error", {
      error: String(err?.message || err),
    });
    return res.status(502).json({ error: "AI request failed" });
  }
}

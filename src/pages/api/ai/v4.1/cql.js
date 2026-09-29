/**
 * API route: natural language → CQL, v4.1.
 *
 * Identical to v4 except that FBI-API suggestions are reranked with
 * voyageai/rerank-2.5-lite before the best suggestion is selected.
 */

/* eslint-disable no-console */

import { OpenRouterError } from "@/lib/aiCql/openrouter";
import { getConfig } from "@/lib/aiCql/v4/provider";
import {
  createRerankedSuggestImpl,
  getRerankConfig,
  getSuggestConfig,
} from "@/lib/aiCql/v4.1/suggest";
import { translate as translateV4 } from "@/pages/api/ai/v4/cql";
import { getAccessToken } from "@/pages/api/ai/v3.1/cql";

const MAX_PROMPT_LENGTH = 1000;
const LOG_PREFIX = "ai/v4.1/cql";

function getOpenRouterErrorMessage(err) {
  try {
    const body = JSON.parse(err.body);
    return body?.error?.message || body?.message || err.message;
  } catch {
    return err.message;
  }
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
  } = {}
) {
  const cfg = config || getConfig();
  const rankedSuggestImpl = createRerankedSuggestImpl({
    config: rerankConfig || getRerankConfig(process.env, cfg),
    suggestImpl,
    rerankImpl,
  });

  return translateV4(prompt, {
    config: cfg,
    suggest,
    accessToken,
    fetchImpl,
    suggestImpl: rankedSuggestImpl,
  });
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

/**
 * Catalogue suggestions for AI search v4.1.
 *
 * Uses the v4 FBI-API lookup, then reranks its candidates through OpenRouter.
 * Any reranker failure preserves the suggester's original ordering.
 */

import { fetchSuggestions, getSuggestConfig } from "@/lib/aiCql/v4/suggest";

const MODEL = "voyageai/rerank-2.5-lite";
const DEFAULT_TIMEOUT_MS = 4000;
const RERANK_TOP_N = 3;

export { getSuggestConfig };

export function getRerankConfig(env = process.env, openRouterConfig = {}) {
  const timeoutMs = parseInt(env.AI_CQL_RERANK_TIMEOUT_MS ?? "", 10);
  const providerConfig =
    openRouterConfig.provider === "glyphgate" ? {} : openRouterConfig;
  return {
    apiKey: providerConfig.apiKey || env.OPENROUTER_API_KEY || "",
    baseUrl: (
      providerConfig.baseUrl ||
      env.OPENROUTER_BASE_URL ||
      "https://openrouter.ai/api/v1"
    ).replace(/\/+$/, ""),
    model: MODEL,
    timeoutMs:
      Number.isFinite(timeoutMs) && timeoutMs > 0
        ? timeoutMs
        : DEFAULT_TIMEOUT_MS,
    referer:
      providerConfig.referer ||
      env.OPENROUTER_REFERER ||
      env.EXTERNAL_BASE_URL ||
      "",
    title:
      providerConfig.title || env.OPENROUTER_TITLE || "bibliotek.dk AI search",
  };
}

export async function rerankSuggestions({
  query,
  documents,
  config,
  fetchImpl = fetch,
}) {
  const candidates = documents.slice(0, RERANK_TOP_N);
  const rest = documents.slice(RERANK_TOP_N);

  if (!config?.apiKey || !query || candidates.length < 2) {
    return documents;
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
        documents: candidates,
        top_n: candidates.length,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return documents;
    }

    const json = JSON.parse(await response.text());
    const ranked = (json?.results || [])
      .map((result) => candidates[result?.index])
      .filter((document) => typeof document === "string");

    return ranked.length === candidates.length
      ? [...ranked, ...rest]
      : documents;
  } catch {
    return documents;
  } finally {
    clearTimeout(timer);
  }
}

export function createRerankedSuggestImpl({
  config,
  suggestImpl = fetchSuggestions,
  rerankImpl = rerankSuggestions,
}) {
  return async (params) => {
    const documents = await suggestImpl(params);
    return rerankImpl({
      query: params.q,
      documents,
      config,
      fetchImpl: params.fetchImpl,
    });
  };
}

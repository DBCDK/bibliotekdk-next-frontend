import { getConfig as getOpenRouterConfig } from "@/lib/aiCql/openrouter";

export const PROVIDER = "openrouter";

const GLYPHGATE_MODEL = "google/gemma-4-26B-A4B-internal";
const GLYPHGATE_BASE_URL = "https://glyph-gate.dbc.dk";
const GLYPHGATE_TIMEOUT_MS = 30000;

function getGlyphGateBaseUrl(value) {
  const baseUrl = (value || GLYPHGATE_BASE_URL).replace(/\/+$/, "");
  return baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`;
}

export function getConfig(env = process.env, provider = PROVIDER) {
  if (provider === "openrouter") {
    return getOpenRouterConfig(env);
  }

  return {
    provider: "glyphgate",
    apiKey: env.LLMTOKEN || "",
    baseUrl: getGlyphGateBaseUrl(env.LLM_BASE_URL),
    model: GLYPHGATE_MODEL,
    fallbackModels: [],
    timeoutMs: parseInt(env.LLM_TIMEOUT_MS || "", 10) || GLYPHGATE_TIMEOUT_MS,
    referer: "",
    title: "",
    requireParameters: false,
  };
}

/**
 * @file
 * Minimal OpenRouter chat-completions client (OpenAI-compatible contract).
 *
 * https://openrouter.ai/docs/api-reference/chat-completion
 *
 * Configuration (server-side env, never exposed to the client):
 *   OPENROUTER_API_KEY          required
 *   OPENROUTER_BASE_URL         default https://openrouter.ai/api/v1
 *   OPENROUTER_MODEL            default see DEFAULTS.model below
 *   OPENROUTER_FALLBACK_MODELS  optional, comma separated → OpenRouter `models` routing
 *   OPENROUTER_TIMEOUT_MS       default 20000
 *   OPENROUTER_REQUIRE_PARAMETERS  "true" to set provider.require_parameters (default off)
 *   OPENROUTER_REFERER          optional HTTP-Referer for app attribution
 *   OPENROUTER_TITLE            optional X-Title for app attribution
 */

const DEFAULTS = Object.freeze({
  baseUrl: "https://openrouter.ai/api/v1",
 model: "google/gemma-4-26b-a4b-it",
 //model:"google/gemma-3-12b-it",
 timeoutMs: 20000,
  title: "bibliotek.dk AI search",
});

/**
 * Reads the configuration from the environment.
 */
export function getConfig(env = process.env) {
  const fallbacks = (env.OPENROUTER_FALLBACK_MODELS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    apiKey: env.OPENROUTER_API_KEY || "",
    baseUrl: (env.OPENROUTER_BASE_URL || DEFAULTS.baseUrl).replace(/\/+$/, ""),
    model: env.OPENROUTER_MODEL || DEFAULTS.model,
    fallbackModels: fallbacks,
    timeoutMs:
      parseInt(env.OPENROUTER_TIMEOUT_MS || "", 10) || DEFAULTS.timeoutMs,
    referer: env.OPENROUTER_REFERER || env.EXTERNAL_BASE_URL || "",
    title: env.OPENROUTER_TITLE || DEFAULTS.title,
    requireParameters: env.OPENROUTER_REQUIRE_PARAMETERS === "true",
  };
}

export class OpenRouterError extends Error {
  constructor(message, { status, body, timeout = false } = {}) {
    super(message);
    this.name = "OpenRouterError";
    this.status = status;
    this.body = body;
    this.timeout = timeout;
  }

  /**
   * True when OpenRouter could not find a provider for the requested
   * parameters (typically tools / tool_choice). Worth retrying without them.
   */
  get isRoutingError() {
    return (
      this.status === 404 &&
      /No endpoints found|routing/i.test(String(this.body || this.message))
    );
  }
}

/**
 * Performs one chat completion.
 *
 * @param {Object} params
 * @param {Array} params.messages
 * @param {Array} [params.tools]
 * @param {Object|string} [params.toolChoice]
 * @param {Object} [params.responseFormat] e.g. { type: "json_object" }
 * @param {number} [params.temperature]
 * @param {number} [params.maxTokens]
 * @param {Object} [params.config] result of getConfig()
 * @param {Function} [params.fetchImpl] injectable fetch (tests)
 * @returns {Promise<{ json: Object, durationMs: number }>}
 */
export async function chatCompletion({
  messages,
  tools,
  toolChoice,
  responseFormat,
  temperature = 0,
  maxTokens = 800,
  config = getConfig(),
  fetchImpl = fetch,
}) {
  if (!config.apiKey) {
    throw new OpenRouterError("OPENROUTER_API_KEY is not configured");
  }

  const body = {
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  if (config.fallbackModels.length) {
    // `models` enables OpenRouter's fallback routing; first entry is primary
    body.models = [config.model, ...config.fallbackModels];
  } else {
    body.model = config.model;
  }

  if (tools?.length) {
    body.tools = tools;
    body.tool_choice = toolChoice || "required";
  }
  body.reasoning = { enabled: false };

  if (responseFormat) {
    body.response_format = responseFormat;
  }
  // Opt-in: only route to providers that honour every parameter. Off by
  // default because it easily leaves no endpoint at all (404 "No endpoints
  // found that can handle the requested parameters").
  if (config.requireParameters) {
    body.provider = { require_parameters: true };
  }

  // body.provider = {
  //   order: ["dekallm"],
  //   allow_fallbacks: true,
  //   require_parameters: config.requireParameters,
  // };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
    "X-Title": config.title,
  };
  if (config.referer) {
    headers["HTTP-Referer"] = config.referer;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);
  const start = Date.now();

  try {
    const res = await fetchImpl(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new OpenRouterError(`OpenRouter responded ${res.status}`, {
        status: res.status,
        body: text?.slice(0, 500),
      });
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new OpenRouterError("OpenRouter returned non-JSON body", {
        status: res.status,
        body: text?.slice(0, 500),
      });
    }
    if (json?.error) {
      throw new OpenRouterError(
        `OpenRouter error: ${json.error.message || "unknown"}`,
        {
          status: json.error.code,
          body: JSON.stringify(json.error).slice(0, 500),
        }
      );
    }
    return { json, durationMs: Date.now() - start };
  } catch (err) {
    if (err instanceof OpenRouterError) {
      throw err;
    }
    if (err?.name === "AbortError") {
      throw new OpenRouterError("OpenRouter request timed out", {
        timeout: true,
      });
    }
    throw new OpenRouterError(
      `OpenRouter request failed: ${err?.message || err}`
    );
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Extracts the tool-call arguments (parsed JSON) from a completion. Falls
 * back to a JSON object embedded in the assistant text when the provider did
 * not return a proper tool call.
 *
 * @param {Object} completion
 * @param {string} [toolName]
 * @returns {Object|null}
 */
export function extractToolArguments(completion, toolName) {
  const message = completion?.choices?.[0]?.message;
  if (!message) {
    return null;
  }

  const calls = Array.isArray(message.tool_calls) ? message.tool_calls : [];
  const call =
    calls.find((c) => !toolName || c?.function?.name === toolName) || calls[0];
  if (call?.function?.arguments !== undefined) {
    const args = call.function.arguments;
    if (typeof args === "object" && args !== null) {
      return args;
    }
    const parsed = safeParseJson(args);
    if (parsed) {
      return parsed;
    }
  }

  const content = Array.isArray(message.content)
    ? message.content.map((c) => c?.text || "").join("\n")
    : message.content;
  return safeParseJson(content);
}

function safeParseJson(text) {
  if (typeof text !== "string") {
    return null;
  }
  let s = text.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    s = fence[1].trim();
  }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) {
    return null;
  }
  try {
    const parsed = JSON.parse(s.slice(first, last + 1));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Pulls token usage (incl. cache hits) out of a completion for logging.
 */
export function extractUsage(completion) {
  const u = completion?.usage;
  if (!u) {
    return null;
  }
  return {
    promptTokens: u.prompt_tokens ?? null,
    completionTokens: u.completion_tokens ?? null,
    cachedTokens:
      u.prompt_tokens_details?.cached_tokens ??
      u.cache_read_input_tokens ??
      null,
    cost: u.cost ?? null,
  };
}

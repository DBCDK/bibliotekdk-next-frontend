/**
 * @file
 * API route: natural language → CQL, v3.1.
 *
 * Same pipeline as /api/ai/v3/cql (forced tool call → JSON AST → deterministic
 * compiler → CQL), plus validation of the result against FBI-API:
 *
 *  1. The compiled CQL is sent to complexSearch and its hit count is read.
 *  2. If it has 0 hits, the AST is relaxed deterministically (src/lib/aiCql/relax.js
 *     – drop negations, drop the least essential clauses one by one, demote the
 *     last clause to the default index) and the candidates are checked in
 *     small parallel batches until one has hits.
 *  3. Still nothing: the prompt itself is tried (quoted phrase, then its
 *     significant words ANDed).
 *  4. If nothing has hits, or FBI-API could not be reached, the original
 *     translation is returned unchanged; validation never fails the request.
 *
 * Response: v3 body plus
 *   hitcount   hits of the returned `cql` (null when not validated)
 *   validated  false when the hit count could not be checked
 *   strategy   "original" | "drop-negations" | "drop:<field>" |
 *              "demote:<field>" | "fallback:phrase" | "fallback:words"
 *   original   { cql, hitcount } of the first translation
 *   attempts   every CQL that was checked, in order: [{ strategy, cql, hitcount }]
 *   timing     { llm, hitcount, total } in ms
 *
 * Disable validation with AI_CQL_VALIDATE=false (then the route behaves like v3).
 */

/* eslint-disable no-console */

import { getServerSession } from "@dbcdk/login-nextjs/server";

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
  getConfig,
  extractUsage,
  OpenRouterError,
} from "@/lib/aiCql/openrouter";
import {
  fetchHitcount,
  firstWithHits,
  getValidationConfig,
  HitcountError,
} from "@/lib/aiCql/hitcount";
import { fallbackCandidates, relaxCandidates } from "@/lib/aiCql/relax";
import { decodeCookie } from "@/utils/jwt";

const MAX_PROMPT_LENGTH = 1000;
const LOG_PREFIX = "ai/v3.1/cql";
const ANON_COOKIE_NAME = "next-auth.anon-session";
const AUTH_COOKIE_NAME = "next-auth.session-token";

function debug(step, data = {}) {
  if (process.env.AI_CQL_DEBUG === "true") {
    console.log(`[${LOG_PREFIX}] ${step}`, data);
  }
}

// Built once per server process – this is the cacheable static prefix.
const SYSTEM_PROMPT = buildSystemPrompt();
const TOOL = buildTool();

/**
 * One chat completion in "tool" mode, falling back to plain JSON output when
 * OpenRouter has no tool-capable endpoint for the model. When `mode` is
 * already "json" (a previous call had to fall back) the tool call is skipped.
 *
 * @returns {Promise<{ json: Object, durationMs: number, mode: string }>}
 */
export async function callModel({ messages, mode = "tool", cfg, fetchImpl }) {
  if (mode === "tool") {
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
        {
          model: cfg.model,
        }
      );
    }
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
 * One translation without validation – identical to v3's translate().
 */
async function translateOnce(prompt, { cfg, fetchImpl, transformAstImpl }) {
  const messages = buildMessages(prompt, { systemPrompt: SYSTEM_PROMPT });
  debug("llm-call:start", { prompt, model: cfg.model });
  const { json, durationMs, mode } = await callModel({
    messages,
    cfg,
    fetchImpl,
  });

  const extractedAst = extractToolArguments(json, TOOL_NAME);
  const ast =
    extractedAst && transformAstImpl
      ? transformAstImpl(extractedAst)
      : extractedAst;
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
  debug("llm-call:output", {
    json,
    ast,
    cql,
    warnings: compiled.warnings,
    resolutions: compiled.resolutions,
    fallback,
    durationMs,
    mode,
  });

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
    llmMs: durationMs,
    messages,
  };
}

/**
 * Runs the whole translation + validation for a prompt. Exported for tests /
 * scripts.
 *
 * @param {string} prompt
 * @param {Object} [options]
 * @param {Object} [options.config] OpenRouter config override
 * @param {Object} [options.validation] result of getValidationConfig()
 * @param {string} [options.accessToken] FBI-API bearer token (no validation without it)
 * @param {Function} [options.fetchImpl] fetch used for the LLM
 * @param {Function} [options.hitcountImpl] replaces fetchHitcount (tests)
 * @param {Function} [options.transformAstImpl] optional AST transform used by later route versions
 * @param {Function} [options.resolveAstImpl] optional AST resolver used by later route versions
 * @returns {Promise<Object>} response body
 */
export async function translate(
  prompt,
  {
    config,
    validation,
    accessToken,
    fetchImpl,
    hitcountImpl = fetchHitcount,
    transformAstImpl,
    resolveAstImpl,
  } = {}
) {
  const started = Date.now();
  const cfg = config || getConfig();
  const val = validation || getValidationConfig();
  debug("pipeline:start", {
    prompt,
    model: cfg.model,
    validationEnabled: val.enabled,
  });

  const base = await translateOnce(prompt, {
    cfg,
    fetchImpl,
    transformAstImpl,
  });

  const llmMs = base.llmMs;
  let hitcountMs = 0;
  const usage = base.usage;
  const attempts = [];

  const finish = (chosen) => {
    const result = {
      cql: chosen.cql,
      ast: chosen.ast,
      note: chosen.note,
      resolutions: chosen.resolutions,
      warnings: chosen.warnings,
      fallback: chosen.fallback,
      model: base.model,
      mode: base.mode,
      usage,
      hitcount: chosen.hitcount ?? null,
      validated: chosen.validated,
      ...(chosen.validationError
        ? { validationError: chosen.validationError }
        : {}),
      strategy: chosen.strategy,
      original: { cql: base.cql, hitcount: attempts[0]?.hitcount ?? null },
      attempts,
      timing: { llm: llmMs, hitcount: hitcountMs, total: Date.now() - started },
    };
    debug("pipeline:finish", result);
    return result;
  };

  const unvalidated = (reason) =>
    finish({
      ...base,
      hitcount: null,
      validated: false,
      strategy: "original",
      ...(reason ? { validationError: reason } : {}),
    });

  if (!val.enabled) {
    return unvalidated();
  }
  if (!base.cql) {
    return unvalidated("No CQL to validate");
  }
  if (!accessToken) {
    return unvalidated("No FBI-API access token");
  }
  if (!val.url) {
    return unvalidated("FBI-API url is not configured");
  }

  const deadline = started + val.budgetMs;
  const hasTime = () => Date.now() < deadline;
  const check = async (cql) => {
    const r = await hitcountImpl({
      cql,
      accessToken,
      url: val.url,
      timeoutMs: val.timeoutMs,
      fetchImpl,
    });
    hitcountMs += r.durationMs || 0;
    return r;
  };
  const record = (strategy, cql, r) => {
    const attempt = { strategy, cql, hitcount: r.hitcount };
    if (r.errorMessage) {
      attempt.errorMessage = r.errorMessage;
    }
    attempts.push(attempt);
    debug("hitcount", attempt);
    return attempt;
  };
  const relaxed = (candidate, extra = {}) => {
    const compiled = candidate.ast
      ? compile(candidate.ast)
      : { resolutions: [], warnings: [] };
    return finish({
      cql: candidate.cql,
      ast: candidate.ast,
      note: extra.note ?? base.note,
      resolutions: compiled.resolutions,
      warnings: [
        ...compiled.warnings,
        `Original query had 0 hits → ${candidate.strategy}`,
      ],
      fallback: extra.fallback ?? false,
      hitcount: candidate.hitcount,
      validated: true,
      strategy: candidate.strategy,
    });
  };

  try {
    // 1. the translation itself
    const first = await check(base.cql);
    record("original", base.cql, first);
    if (first.hitcount > 0) {
      return finish({
        ...base,
        hitcount: first.hitcount,
        validated: true,
        strategy: "original",
      });
    }
    debug("zero-hit", { cql: base.cql, ast: base.ast });

    const tried = new Set([base.cql]);

    if (base.ast && hasTime() && resolveAstImpl) {
      const correction = await resolveAstImpl(base.ast, {
        accessToken,
        url: val.url,
        timeoutMs: val.timeoutMs,
      });
      if (correction) {
        const compiled = compile(correction.ast);
        const strategy = correction.strategy || "resolved";
        debug("resolver:candidate", {
          strategy,
          ast: correction.ast,
          cql: compiled.cql,
          resolutions: correction.resolutions,
        });
        if (compiled.cql && !tried.has(compiled.cql)) {
          tried.add(compiled.cql);
          const h = await check(compiled.cql);
          record(strategy, compiled.cql, h);
          if (h.hitcount > 0) {
            return finish({
              ...base,
              cql: compiled.cql,
              ast: correction.ast,
              resolutions: [...compiled.resolutions, ...correction.resolutions],
              warnings: [
                ...compiled.warnings,
                `Original query had 0 hits → ${strategy}`,
              ],
              hitcount: h.hitcount,
              validated: true,
              strategy,
            });
          }
          debug("resolver:zero-hit", { strategy, cql: compiled.cql });
        }
      } else {
        debug("resolver:none");
      }
    }

    // 2. deterministic relaxation of the original structure
    const candidates = [];
    for (const ast of [base.ast]) {
      if (!ast || candidates.length >= val.maxRelaxations) {
        continue;
      }
      candidates.push(
        ...relaxCandidates(ast, {
          limit: val.maxRelaxations - candidates.length,
          exclude: [...tried, ...candidates.map((c) => c.cql)],
        })
      );
    }
    debug("relaxation:candidates", {
      candidates: candidates.map(({ strategy, cql }) => ({ strategy, cql })),
    });
    let winner = await firstWithHits(candidates, {
      check,
      concurrency: val.concurrency,
      hasTime,
      attempts,
    });
    if (winner) {
      return relaxed(winner);
    }

    // 3. the prompt itself
    const exclude = new Set([...tried, ...candidates.map((c) => c.cql)]);
    const fallbacks = fallbackCandidates(prompt, { exclude });
    debug("fallback:candidates", {
      candidates: fallbacks.map(({ strategy, cql }) => ({ strategy, cql })),
    });
    winner = await firstWithHits(fallbacks, {
      check,
      concurrency: val.concurrency,
      hasTime,
      attempts,
    });
    if (winner) {
      return relaxed(winner, { fallback: true });
    }

    // 4. nothing has hits: return the honest translation
    return finish({
      ...base,
      hitcount: 0,
      validated: true,
      strategy: "original",
    });
  } catch (err) {
    if (err instanceof HitcountError) {
      console.warn(
        `${LOG_PREFIX}: hitcount check failed, returning unvalidated CQL`,
        {
          error: err.message,
          status: err.status,
          timeout: err.timeout,
        }
      );
      return unvalidated(err.message);
    }
    throw err;
  }
}

/**
 * Reads the FBI-API token from the authenticated or anonymous session cookie,
 * creating a fresh anonymous session when neither cookie is usable. This is
 * the same token flow used by /api/[profile]/graphql.
 */
export async function getAccessToken(req, res) {
  try {
    const existingCookie =
      req.cookies?.[AUTH_COOKIE_NAME] || req.cookies?.[ANON_COOKIE_NAME];
    let jwtToken = await decodeCookie(existingCookie);
    if (jwtToken?.accessToken) {
      debug("access-token", {
        source: req.cookies?.[AUTH_COOKIE_NAME]
          ? "authenticated-cookie"
          : "anonymous-cookie",
      });
      return jwtToken.accessToken;
    }

    const session = await getServerSession(req, res);
    if (session?.accessToken) {
      debug("access-token", { source: "session-response" });
      return session.accessToken;
    }

    const setCookie = res.getHeader("Set-Cookie");
    const cookieHeaders = Array.isArray(setCookie)
      ? setCookie
      : setCookie
      ? [setCookie]
      : [];
    const anonymousCookie = cookieHeaders
      .find((cookie) => cookie.startsWith(`${ANON_COOKIE_NAME}=`))
      ?.split(";")[0]
      ?.slice(ANON_COOKIE_NAME.length + 1);
    jwtToken = await decodeCookie(anonymousCookie);
    debug("access-token", {
      source: jwtToken?.accessToken ? "new-anonymous-cookie" : "unavailable",
    });
    return jwtToken?.accessToken || null;
  } catch (err) {
    console.warn(`${LOG_PREFIX}: could not read session`, {
      error: String(err?.message || err),
    });
    return null;
  }
}

/**
 * Creates an API handler so later route versions can reuse validation and
 * authentication while supplying their own translation pipeline.
 *
 * @param {Object} [options]
 * @param {Function} [options.translateImpl]
 * @param {string} [options.logPrefix]
 */
export function createHandler({
  translateImpl = translate,
  logPrefix = LOG_PREFIX,
} = {}) {
  /**
   * @param {import("next").NextApiRequest} req
   * @param {import("next").NextApiResponse} res
   */
  return async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const config = getConfig();
    if (!config.apiKey) {
      console.error(`${logPrefix}: OPENROUTER_API_KEY is not configured`);
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

    const validation = getValidationConfig();
    const accessToken = validation.enabled
      ? await getAccessToken(req, res)
      : null;

    try {
      const result = await translateImpl(prompt, {
        config,
        validation,
        accessToken,
      });

      if (!result.cql) {
        console.error(`${logPrefix}: no CQL could be produced`, { prompt });
        return res.status(502).json({ error: "Could not generate CQL" });
      }

      console.log(`${logPrefix}: translated`, {
        model: result.model,
        fallback: result.fallback,
        validated: result.validated,
        hitcount: result.hitcount,
        strategy: result.strategy,
        attempts: result.attempts.length,
        warnings: result.warnings.length,
        llmMs: result.timing.llm,
        hitcountMs: result.timing.hitcount,
        totalMs: result.timing.total,
        cachedTokens: result.usage?.cachedTokens ?? null,
        promptTokens: result.usage?.promptTokens ?? null,
      });

      return res.status(200).json(result);
    } catch (err) {
      if (err instanceof OpenRouterError) {
        console.error(`${logPrefix}: LLM request failed`, {
          error: err.message,
          status: err.status,
          body: err.body,
          timeout: err.timeout,
        });
        return res.status(err.timeout ? 504 : 502).json({
          error: err.timeout ? "AI service timeout" : "AI service unavailable",
        });
      }
      console.error(`${logPrefix}: request error`, {
        error: String(err?.message || err),
      });
      return res.status(502).json({ error: "AI request failed" });
    }
  };
}

export default createHandler();

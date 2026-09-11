/**
 * @file
 * API route: natural language → CQL, v3.2.
 *
 * Extends v3.1 with worktype-only material filtering and catalogue-backed
 * creator-name correction. Names use the first FBI-API suggestion.
 */

/* eslint-disable no-console */

import {
  createHandler,
  translate as translateV31,
} from "@/pages/api/ai/v3.1/cql";

const LOG_PREFIX = "ai/v3.2/cql";
const CREATOR_FIELDS = new Set([
  "creator",
  "contributor",
  "creatorcontributor",
]);
const CREATOR_SUGGEST_QUERY = `query AiCqlCreatorSuggest($q: String!) {
  complexSuggest(q: $q, type: CREATOR) {
    result {
      term
    }
  }
}`;

function toWorktype(value) {
  const normalized = String(value).toLowerCase();
  if (/bog|book|tegneserie|comic/.test(normalized)) {
    return "literature";
  }
  if (/artikel|article/.test(normalized)) {
    return "article";
  }
  if (/film|dvd|blu-ray|bluray|movie/.test(normalized)) {
    return "movie";
  }
  if (/musik|cd|vinyl|grammofon|music/.test(normalized)) {
    return "music";
  }
  if (/node|sheet music/.test(normalized)) {
    return "sheetmusic";
  }
  if (/spil|game/.test(normalized)) {
    return "game";
  }
  if (/tidsskrift|avis|magazine|newspaper|periodical/.test(normalized)) {
    return "periodica";
  }
  return "other";
}

export function useWorktype(ast) {
  if (!Array.isArray(ast?.clauses)) {
    return ast;
  }
  return {
    ...ast,
    clauses: ast.clauses.map((clause) =>
      clause?.field === "specificmaterialtype" && Array.isArray(clause.values)
        ? {
            ...clause,
            field: "worktype",
            values: [...new Set(clause.values.map(toWorktype))],
          }
        : clause
    ),
  };
}

function debug(step, data = {}) {
  if (process.env.AI_CQL_DEBUG === "true") {
    console.log(`[${LOG_PREFIX}] ${step}`, data);
  }
}

export function selectCreatorSuggestion(suggestions) {
  const value = suggestions.find((suggestion) => String(suggestion).trim());
  return value ? String(value).trim() : null;
}

export async function fetchCreatorSuggestions({
  q,
  accessToken,
  url,
  timeoutMs,
  fetchImpl = fetch,
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  debug("creator-suggester:start", { q, url });
  try {
    const res = await fetchImpl(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: CREATOR_SUGGEST_QUERY,
        variables: { q },
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      debug("creator-suggester:http-error", { q, status: res.status });
      return [];
    }
    const json = JSON.parse(await res.text());
    const suggestions = (json?.data?.complexSuggest?.result || [])
      .map((item) => item?.term)
      .filter(Boolean);
    debug("creator-suggester:result", { q, suggestions });
    return suggestions;
  } catch (err) {
    debug("creator-suggester:error", {
      q,
      error: String(err?.message || err),
    });
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function correctCreatorNames(
  ast,
  { accessToken, url, timeoutMs, suggestImpl = fetchCreatorSuggestions }
) {
  if (!Array.isArray(ast?.clauses)) {
    return null;
  }
  const resolutions = [];
  const clauses = await Promise.all(
    ast.clauses.map(async (clause) => {
      if (!CREATOR_FIELDS.has(clause?.field) || !Array.isArray(clause.values)) {
        return clause;
      }
      const values = await Promise.all(
        clause.values.map(async (input) => {
          const suggestions = await suggestImpl({
            q: input,
            accessToken,
            url,
            timeoutMs,
          });
          const match = selectCreatorSuggestion(suggestions);
          debug("creator-suggestions", {
            field: clause.field,
            input,
            suggestions,
            accepted: match,
          });
          if (!match) {
            return input;
          }
          resolutions.push({
            field: clause.field,
            input,
            value: match,
            method: "catalogue-suggestion",
          });
          return match;
        })
      );
      return { ...clause, values };
    })
  );
  return resolutions.length
    ? {
        ast: { ...ast, clauses },
        resolutions,
        strategy: "catalogue-correction",
      }
    : null;
}

export function translate(prompt, { suggestImpl, ...options } = {}) {
  return translateV31(prompt, {
    ...options,
    transformAstImpl: useWorktype,
    resolveAstImpl: (ast, context) =>
      correctCreatorNames(ast, { ...context, suggestImpl }),
  });
}

export default createHandler({
  translateImpl: translate,
  logPrefix: LOG_PREFIX,
});

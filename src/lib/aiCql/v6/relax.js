/**
 * Query relaxation for AI search v6.
 *
 * When the v4.1 query has 0 hits, the positive clauses are ranked once
 * against the prompt with voyageai/rerank-2.5-lite, and broader candidates
 * are built by dropping the lowest ranked clause, then the next, and so on.
 * Negated clauses are dropped first. Any reranker failure falls back to the
 * deterministic DROP_PRIORITY order from src/lib/aiCql/relax.js.
 */

import { compile } from "@/lib/aiCql/compiler";
import { dropRank } from "@/lib/aiCql/relax";
import { FIELDS, FIELD_ALIASES } from "@/lib/aiCql/v4/indexes";

const COMPILE_OPTIONS = { fields: FIELDS, fieldAliases: FIELD_ALIASES };
const MAX_CANDIDATES = 3;

function isNegated(clause) {
  return clause?.negate === true;
}

function clauseValues(clause) {
  return Array.isArray(clause?.values) ? clause.values : [clause?.values];
}

export function positiveClauses(ast) {
  return (ast?.clauses || []).filter(
    (c) => c && typeof c === "object" && !isNegated(c)
  );
}

export function clauseDocument(clause) {
  return `${clause.field}: ${clauseValues(clause).filter(Boolean).join(", ")}`;
}

/**
 * Clause indices from most to least essential by DROP_PRIORITY; among equals
 * the earlier clause is kept longer.
 */
export function priorityOrder(clauses) {
  return clauses
    .map((clause, i) => i)
    .sort(
      (a, b) => dropRank(clauses[b].field) - dropRank(clauses[a].field) || a - b
    );
}

/**
 * Ranks clauses by relevance to the prompt.
 *
 * @returns {Promise<{ order: number[], method: "reranker"|"priority" }>}
 *   clause indices, most relevant first
 */
export async function rankClauses({
  query,
  clauses,
  config,
  fetchImpl = fetch,
}) {
  const fallback = { order: priorityOrder(clauses), method: "priority" };

  if (!config?.apiKey || !query || clauses.length < 2) {
    return fallback;
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
        documents: clauses.map(clauseDocument),
        top_n: clauses.length,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return fallback;
    }

    const json = JSON.parse(await response.text());
    const order = (json?.results || [])
      .map((result) => result?.index)
      .filter((i) => Number.isInteger(i) && i >= 0 && i < clauses.length);

    return new Set(order).size === clauses.length
      ? { order, method: "reranker" }
      : fallback;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Broader candidates for an AST, least relaxed first.
 *
 * @param {Object} ast
 * @param {number[]} order indices into the positive clauses, most relevant first
 * @param {Object} [options]
 * @param {Iterable<string>} [options.exclude] CQL strings already tried
 * @returns {Array<{ strategy: string, ast: Object, cql: string }>}
 */
export function relaxCandidates(
  ast,
  order,
  { exclude = [], limit = MAX_CANDIDATES } = {}
) {
  const seen = new Set(exclude);
  const candidates = [];
  const clauses = (ast?.clauses || []).filter(
    (c) => c && typeof c === "object"
  );
  const positives = positiveClauses(ast);

  const emit = (strategy, nextClauses) => {
    if (candidates.length >= limit || !nextClauses.length) {
      return;
    }
    const nextAst = { ...ast, clauses: nextClauses };
    const { cql } = compile(nextAst, COMPILE_OPTIONS);
    if (!cql || seen.has(cql)) {
      return;
    }
    seen.add(cql);
    candidates.push({ strategy, ast: nextAst, cql });
  };

  if (positives.length < clauses.length) {
    emit("drop-negations", positives);
  }

  const kept = [...order];
  while (kept.length > 1 && candidates.length < limit) {
    const dropped = positives[kept.pop()];
    emit(
      `drop:${dropped.field}`,
      positives.filter((_, i) => kept.includes(i))
    );
  }

  return candidates;
}

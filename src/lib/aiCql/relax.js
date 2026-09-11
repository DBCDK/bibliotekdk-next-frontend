/**
 * @file
 * Deterministic query relaxation for AI search v3.1.
 *
 * When the compiled CQL has 0 hits in FBI-API, the query AST is broadened
 * step by step and every step is compiled to a new CQL candidate. The
 * candidates are ordered from "closest to the original" to "broadest", and
 * the route checks them in that order until one has hits.
 *
 * The ladder is cumulative:
 *   1. drop-negations   remove all NOT clauses
 *   2. drop:<field>     remove the least essential remaining clause, repeated
 *                       while more than one positive clause is left
 *   3. demote:<field>   search the last clause's value in the default index
 *
 * After that the prompt itself is used (fallbackCandidates): the whole text as
 * one quoted default-index term, then its significant words ANDed.
 */

import { compile, fallbackCql, quote, sanitizeText } from "./compiler";
import { FIELDS, KIND, normalizeFieldName } from "./indexes";

/**
 * Fields ordered from least to most essential. When a query has no hits the
 * clause on the field that comes FIRST in this list is dropped first.
 * Descriptors and audience first, then time, material and language, then
 * genre, then subject; who/what the user asked for (creator, title,
 * identifiers) is kept as long as possible.
 */
export const DROP_PRIORITY = Object.freeze([
  // decorative descriptors
  "libraryrecommendation",
  "narrativetechnique",
  "mood",
  "generalaudience",
  "primarytarget",
  "setting",
  "players",
  "instrument",
  "schooluse",
  "childrentopic",
  "fictionalcharacter",
  // availability, audience numbers, film/game details
  "accesstype",
  "canalwaysbeloaned",
  "subtitlelanguage",
  "spokenlanguage",
  "filmnationality",
  "gameplatform",
  "pegi",
  "mediacouncilagerestriction",
  "lix",
  "ages",
  "childrenoradults",
  // time
  "datefirstedition",
  "publicationyear",
  "workyear",
  // material and language
  "language",
  "mainlanguage",
  "specificmaterialtype",
  "generalmaterialtype",
  "worktype",
  "fictionnonfiction",
  // what kind of thing
  "genreandform",
  "function",
  "publisher",
  "hostpublication",
  "series",
  "dk5",
  // what it is about
  "subject",
  "contributor",
  "creatorcontributor",
  "default",
  // who / which
  "creator",
  "title",
  "isbn",
  "issn",
]);

const STOPWORDS = new Set(
  (
    "og i på af om der som med til for en et den det de fra har er ikke jeg vi " +
    "du kan vil gerne noget nogle nogen alle mig os din dit min mit hvor hvad " +
    "hvilke hvilken find søg søger vis giv gider have haves findes " +
    "the a an of in on at about by with for and or to from is are be me my " +
    "find search show give some any all books book that which what where"
  ).split(/\s+/)
);

/**
 * Position of a field in DROP_PRIORITY; unknown fields sort in the middle.
 */
export function dropRank(field) {
  const i = DROP_PRIORITY.indexOf(field);
  return i === -1 ? DROP_PRIORITY.indexOf("default") - 1 : i;
}

function canonicalField(clause) {
  return (
    normalizeFieldName(clause?.field ?? clause?.index ?? "default") || "default"
  );
}

function isNegated(clause) {
  return clause?.negate === true || clause?.not === true;
}

/**
 * Index (in `clauses`) of the clause to drop next: lowest priority first,
 * and among equals the last one (later clauses tend to be afterthoughts).
 */
function pickDroppable(clauses) {
  let best = -1;
  let bestRank = Infinity;
  clauses.forEach((clause, i) => {
    const rank = dropRank(canonicalField(clause));
    if (rank <= bestRank) {
      best = i;
      bestRank = rank;
    }
  });
  return best;
}

/**
 * Produces the ordered list of broader query candidates for an AST.
 *
 * @param {Object} ast the AST the LLM returned
 * @param {Object} [options]
 * @param {number} [options.limit] max number of candidates
 * @param {Iterable<string>} [options.exclude] CQL strings already tried
 * @param {Object} [options.vocab] vocab.json-shaped object (tests)
 * @returns {Array<{ strategy: string, ast: Object, cql: string }>}
 */
export function relaxCandidates(ast, { limit = 6, exclude = [], vocab } = {}) {
  const seen = new Set(exclude);
  const candidates = [];

  const rawClauses = Array.isArray(ast?.clauses)
    ? ast.clauses
    : Array.isArray(ast)
    ? ast
    : [];
  const clauses = rawClauses.filter((c) => c && typeof c === "object");
  const combine = ast?.combine;

  const emit = (strategy, nextClauses) => {
    if (candidates.length >= limit || !nextClauses.length) {
      return;
    }
    const nextAst = combine
      ? { clauses: nextClauses, combine }
      : { clauses: nextClauses };
    const { cql } = compile(nextAst, { vocab });
    if (!cql || seen.has(cql)) {
      return;
    }
    seen.add(cql);
    candidates.push({ strategy, ast: nextAst, cql });
  };

  // 1. negations
  let current = clauses;
  if (current.some(isNegated)) {
    current = current.filter((c) => !isNegated(c));
    emit("drop-negations", current);
  }

  // 2. drop clauses, least essential first, while more than one is left
  while (current.length > 1 && candidates.length < limit) {
    const i = pickDroppable(current);
    const dropped = canonicalField(current[i]);
    current = current.filter((_, j) => j !== i);
    emit(`drop:${dropped}`, current);
  }

  // 3. demote the last clause to the default index
  if (current.length === 1 && candidates.length < limit) {
    const last = current[0];
    const field = canonicalField(last);
    const kind = FIELDS[field]?.kind;
    if (
      field !== "default" &&
      kind !== KIND.YEAR &&
      kind !== KIND.NUMBER &&
      kind !== KIND.BOOLEAN
    ) {
      emit(`demote:${field}`, [
        { field: "default", op: "=", values: last.values ?? last.value },
      ]);
    }
  }

  return candidates;
}

/**
 * Splits a prompt into the words worth searching for: no stopwords, no
 * one/two letter tokens, no punctuation.
 *
 * @param {string} prompt
 * @returns {string[]}
 */
export function significantWords(prompt) {
  const words = sanitizeText(prompt)
    .toLowerCase()
    .replace(/\*$/, "")
    .split(/[^\p{L}\p{N}-]+/u)
    .map((w) => w.replace(/^-+|-+$/g, ""))
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  return [...new Set(words)];
}

/**
 * Last-resort candidates built from the prompt text alone.
 *
 * @param {string} prompt
 * @param {Object} [options]
 * @param {Iterable<string>} [options.exclude] CQL strings already tried
 * @returns {Array<{ strategy: string, ast: null, cql: string }>}
 */
export function fallbackCandidates(prompt, { exclude = [] } = {}) {
  const seen = new Set(exclude);
  const candidates = [];
  const push = (strategy, cql) => {
    if (cql && !seen.has(cql)) {
      seen.add(cql);
      candidates.push({ strategy, ast: null, cql });
    }
  };

  push("fallback:phrase", fallbackCql(prompt));

  const words = significantWords(prompt);
  if (words.length >= 1) {
    push("fallback:words", words.map(quote).join(" AND "));
  }

  return candidates;
}

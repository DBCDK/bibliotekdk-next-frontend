/**
 * @file
 * Controlled-vocabulary resolver.
 *
 * After the LLM has produced a value for a controlled field (genre, material
 * type, language, …) this module maps it onto a value that actually exists
 * in FBI-API, using — in order — exact match, alias table, Danish
 * singular/plural inflection, word-boundary prefix (→ wildcard) and finally a
 * fuzzy string match. Everything is local and deterministic; no extra LLM
 * round trip.
 *
 * The vocabulary comes from `vocab.json`, produced by
 * `scripts/ai-vocab-refresh.mjs` (facet dump from FBI-API). When the file is
 * the hand-seeded starter (`source: "seed"`), fuzzy and prefix matches are not
 * trusted for exact `phrase.*` output and the compiler falls back to `term.*`.
 */

import defaultVocab from "./vocab.json";
import { ALIASES } from "./aliases";

export const FUZZY_THRESHOLD = 0.78;
const MIN_FUZZY_LENGTH = 4;

/**
 * Normalizes a string for comparison: NFC, lowercase, no quotes, single spaces.
 *
 * @param {string} s
 * @returns {string}
 */
export function normalize(s) {
  return String(s ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/["'`´’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function bigrams(s) {
  const padded = ` ${s} `;
  const out = new Map();
  for (let i = 0; i < padded.length - 1; i++) {
    const g = padded.slice(i, i + 2);
    out.set(g, (out.get(g) || 0) + 1);
  }
  return out;
}

/**
 * Sørensen–Dice coefficient over character bigrams (0..1).
 */
export function dice(a, b) {
  if (!a || !b) {
    return 0;
  }
  if (a === b) {
    return 1;
  }
  const ga = bigrams(a);
  const gb = bigrams(b);
  let common = 0;
  let total = 0;
  for (const [g, n] of ga) {
    total += n;
    if (gb.has(g)) {
      common += Math.min(n, gb.get(g));
    }
  }
  for (const n of gb.values()) {
    total += n;
  }
  return total === 0 ? 0 : (2 * common) / total;
}

/**
 * Levenshtein similarity ratio (0..1).
 */
export function levenshteinRatio(a, b) {
  if (a === b) {
    return 1;
  }
  const la = a.length;
  const lb = b.length;
  if (!la || !lb) {
    return 0;
  }
  let prev = new Array(lb + 1);
  let curr = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) {
    prev[j] = j;
  }
  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return 1 - prev[lb] / Math.max(la, lb);
}

/**
 * Combined similarity used by the fuzzy step.
 */
export function similarity(a, b) {
  return Math.max(dice(a, b), levenshteinRatio(a, b));
}

/**
 * Danish singular/plural variants of a word, used to bridge "roman" ↔
 * "romaner", "biografi" ↔ "biografier", "tegneserie" ↔ "tegneserier".
 *
 * @param {string} s normalized input
 * @returns {string[]} candidate spellings (without the input itself)
 */
export function inflections(s) {
  const out = new Set();
  const suffixes = ["er", "e", "r", "s", "ne", "erne", "en", "et"];
  for (const suf of suffixes) {
    out.add(s + suf);
    if (s.endsWith(suf) && s.length - suf.length >= 3) {
      out.add(s.slice(0, -suf.length));
    }
  }
  // "bog" ↔ "bøger", "bøger" ↔ "bog"
  if (s.endsWith("bøger")) {
    out.add(s.slice(0, -5) + "bog");
  }
  if (s.endsWith("bog")) {
    out.add(s.slice(0, -3) + "bøger");
  }
  out.delete(s);
  return [...out];
}

/**
 * @typedef {Object} VocabEntry
 * @property {string} key Controlled value as returned by FBI-API facets
 * @property {string} norm Normalized key
 * @property {number|null} score Work count from the facet (null when seeded)
 */

const entryCache = new WeakMap();

/**
 * Returns the vocabulary entries for a field, or an empty array.
 *
 * @param {string} name vocab key (FIELDS[field].vocab)
 * @param {Object} [vocab] vocab.json-shaped object (defaults to the bundled one)
 * @returns {VocabEntry[]}
 */
export function getVocab(name, vocab = defaultVocab) {
  let perVocab = entryCache.get(vocab);
  if (!perVocab) {
    perVocab = new Map();
    entryCache.set(vocab, perVocab);
  }
  if (perVocab.has(name)) {
    return perVocab.get(name);
  }
  let raw = vocab?.facets?.[name];
  // phrase.language spans main/spoken/subtitle; fall back to mainlanguage
  if (!raw && name === "language") {
    raw = vocab?.facets?.mainlanguage;
  }
  const entries = Array.isArray(raw)
    ? raw
        .map((item) =>
          Array.isArray(item)
            ? { key: String(item[0]), score: item[1] ?? null }
            : { key: String(item?.key ?? item), score: item?.score ?? null }
        )
        .filter((e) => e.key)
        .map((e) => ({ ...e, norm: normalize(e.key) }))
    : [];
  perVocab.set(name, entries);
  return entries;
}

/**
 * True when the vocabulary was produced from real facet data (not the seed).
 */
export function isTrusted(vocab = defaultVocab) {
  return vocab?.source === "facets";
}

function byScoreDesc(a, b) {
  return (b.score ?? -1) - (a.score ?? -1);
}

function findExact(entries, norm) {
  return entries.find((e) => e.norm === norm) || null;
}

/**
 * Resolves a user/model value against a controlled vocabulary.
 *
 * @param {string} name vocab key
 * @param {string} input raw value from the model
 * @param {Object} [options]
 * @param {Object} [options.vocab] vocab.json-shaped object
 * @returns {{
 *   value: string,          // value to put in the query (without trailing *)
 *   method: "exact"|"alias"|"inflection"|"prefix"|"fuzzy"|"none",
 *   exact: boolean,         // value is a known controlled value
 *   wildcard: boolean,      // value should be emitted with a trailing *
 *   trusted: boolean,       // safe to emit as phrase.* exact
 *   candidates?: string[],  // matched keys for prefix/fuzzy
 *   similarity?: number
 * }}
 */
export function resolveValue(name, input, { vocab = defaultVocab } = {}) {
  const trustedVocab = isTrusted(vocab);
  const entries = getVocab(name, vocab);
  const norm = normalize(input);
  const none = {
    value: norm,
    method: "none",
    exact: false,
    wildcard: false,
    trusted: false,
  };

  if (!norm) {
    return none;
  }

  // The model may already have added a wildcard
  const hadWildcard = norm.endsWith("*");
  const base = hadWildcard ? norm.slice(0, -1).trim() : norm;
  if (!base) {
    return none;
  }

  // 1. exact
  let hit = findExact(entries, base);
  if (hit) {
    return {
      value: hit.key,
      method: "exact",
      exact: true,
      wildcard: false,
      trusted: true,
    };
  }

  // 2. alias table (a trailing * in the alias target forces a wildcard)
  const aliasTarget = lookupAlias(name, base);
  if (aliasTarget) {
    const aliasWildcard = aliasTarget.endsWith("*");
    const aliasNorm = normalize(aliasTarget.replace(/\*$/, ""));
    hit = aliasWildcard ? null : findExact(entries, aliasNorm);
    if (hit) {
      return {
        value: hit.key,
        method: "alias",
        exact: true,
        wildcard: false,
        trusted: true,
      };
    }
    // alias points at a prefix ("lydbog" → "lydbog (cd)", "lydbog (online)")
    const prefixed = prefixMatches(entries, aliasNorm);
    if (prefixed.length || (aliasWildcard && findExact(entries, aliasNorm))) {
      return {
        value: aliasNorm,
        method: "alias",
        exact: false,
        wildcard: true,
        trusted: true,
        candidates: prefixed.map((e) => e.key),
      };
    }
    // alias known, but not in (seeded) vocab – still better than the raw input
    return {
      value: aliasNorm,
      method: "alias",
      exact: false,
      wildcard: false,
      trusted: false,
    };
  }

  // 3. singular / plural
  for (const variant of inflections(base)) {
    hit = findExact(entries, variant);
    if (hit) {
      return {
        value: hit.key,
        method: "inflection",
        exact: true,
        wildcard: false,
        trusted: true,
      };
    }
  }

  // 4. word-boundary prefix → wildcard ("lydbog" → lydbog*, "film" → film*)
  const prefixed = prefixMatches(entries, base);
  if (prefixed.length) {
    return {
      value: base,
      method: "prefix",
      exact: false,
      wildcard: true,
      trusted: true,
      candidates: prefixed.map((e) => e.key),
    };
  }

  // 5. fuzzy – typo tolerance. Candidates must share the first letter with
  //    the input: character similarity alone rates "britiske film" and
  //    "erotiske film" as near-identical.
  if (base.length >= MIN_FUZZY_LENGTH && entries.length) {
    let best = null;
    let bestSim = 0;
    for (const e of entries) {
      if (e.norm[0] !== base[0]) {
        continue;
      }
      const sim = similarity(base, e.norm);
      if (
        sim > bestSim ||
        (sim === bestSim && best && byScoreDesc(e, best) < 0)
      ) {
        best = e;
        bestSim = sim;
      }
    }
    if (best && bestSim >= FUZZY_THRESHOLD) {
      return {
        value: best.key,
        method: "fuzzy",
        exact: true,
        wildcard: false,
        trusted: trustedVocab,
        similarity: Math.round(bestSim * 100) / 100,
        candidates: [best.key],
      };
    }
  }

  return { ...none, value: base, wildcard: hadWildcard };
}

/**
 * Alias lookup. For film nationalities the user often writes the whole phrase
 * ("britiske film"), so the lookup is retried without the trailing "film".
 */
function lookupAlias(name, base) {
  const table = ALIASES[name];
  if (!table) {
    return null;
  }
  if (table[base]) {
    return table[base];
  }
  const stripped = base.replace(/\s+film$/, "");
  if (stripped !== base && table[stripped]) {
    return table[stripped];
  }
  return null;
}

function prefixMatches(entries, base) {
  return entries
    .filter(
      (e) =>
        e.norm.length > base.length &&
        e.norm.startsWith(base) &&
        /[\s(\-–:,]/.test(e.norm[base.length])
    )
    .sort(byScoreDesc);
}

/**
 * Top N values of a vocabulary, for inclusion in the system prompt.
 *
 * @param {string} name
 * @param {number} limit
 * @param {Object} [vocab]
 * @returns {string[]}
 */
export function topValues(name, limit, vocab = defaultVocab) {
  return getVocab(name, vocab)
    .slice()
    .sort(byScoreDesc)
    .slice(0, limit)
    .map((e) => e.key);
}

export { defaultVocab };

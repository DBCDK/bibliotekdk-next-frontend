/**
 * @file
 * Deterministic compiler: query AST (from the LLM) → CQL string.
 *
 * The AST is intentionally tiny:
 *
 *   {
 *     "clauses": [
 *       { "field": "creator", "op": "=", "values": ["kim leine"] },
 *       { "field": "genreandform", "op": "=", "values": ["romaner"] },
 *       { "field": "workyear", "op": ">=", "values": ["2020"] },
 *       { "field": "subject", "op": "=", "values": ["slanger"], "negate": true }
 *     ],
 *     "combine": "AND",
 *     "note": "optional one-line Danish explanation for the user"
 *   }
 *
 * Everything the model can get wrong in raw CQL is handled here: index names
 * are whitelisted, operators are checked per field, controlled values are
 * resolved against the vocabulary, quoting/escaping is done in code, and
 * `NOW - 12 MONTHS` spacing is normalized.
 */

import {
  FIELDS,
  FIELD_ALIASES,
  KIND,
  RANGE_OPS,
  normalizeFieldName,
} from "./indexes";
import { isTrusted, normalize, resolveValue } from "./vocab";

export const MAX_CLAUSES = 12;
export const MAX_VALUES_PER_CLAUSE = 6;
const MAX_VALUE_LENGTH = 200;

const NOW_RE =
  /^now(?:\s*([+-])\s*(\d{1,4})\s*(day|days|dage|month|months|måned|måneder|year|years|år))?$/i;

/**
 * Normalizes a year-ish value: "2020", "NOW", "NOW - 12 MONTHS".
 * Returns null when the value is not usable.
 *
 * @param {string|number} raw
 * @returns {string|null}
 */
export function normalizeYearValue(raw) {
  const s = String(raw ?? "")
    .trim()
    .replace(/\s+/g, " ");
  if (/^\d{4}$/.test(s)) {
    return s;
  }
  const m = s.match(NOW_RE);
  if (!m) {
    return null;
  }
  if (!m[1]) {
    return "NOW";
  }
  let n = parseInt(m[2], 10);
  const unit = m[3].toLowerCase();
  let cqlUnit;
  if (unit.startsWith("day") || unit === "dage") {
    cqlUnit = "DAYS";
  } else if (unit.startsWith("year") || unit === "år") {
    n *= 12;
    cqlUnit = "MONTHS";
  } else {
    cqlUnit = "MONTHS";
  }
  if (n <= 0) {
    return "NOW";
  }
  return `NOW ${m[1]} ${n} ${cqlUnit}`;
}

/**
 * Normalizes an integer value (ages, pegi, lix …).
 *
 * @param {string|number} raw
 * @returns {string|null}
 */
export function normalizeNumberValue(raw) {
  const s = String(raw ?? "").trim();
  const m = s.match(/^(\d{1,3})(?:\s*(?:år|years?|\+))?$/i);
  return m ? String(parseInt(m[1], 10)) : null;
}

/**
 * Cleans a free-text value: strips quotes/backslashes and control chars,
 * collapses whitespace, caps the length. Keeps a single trailing `*`.
 *
 * @param {string} raw
 * @returns {string}
 */
export function sanitizeText(raw) {
  let s = String(raw ?? "")
    .normalize("NFC")
    .replace(/[\\"]/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  s = s.replace(/\*{2,}/g, "*");
  // a wildcard is only meaningful at the end
  const hadWildcard = s.endsWith("*");
  s = s.replace(/\*/g, "").trim();
  if (hadWildcard && s) {
    s += "*";
  }
  // a lone operator word would break the query
  if (/^(and|or|not)$/i.test(s)) {
    s = "";
  }
  return s.slice(0, MAX_VALUE_LENGTH);
}

/**
 * Double-quotes a value for CQL.
 */
export function quote(value) {
  return `"${String(value).replace(/"/g, "")}"`;
}

function normalizeOp(raw) {
  const s = String(raw ?? "=")
    .trim()
    .toLowerCase();
  const map = {
    "": "=",
    "=": "=",
    "==": "=",
    eq: "=",
    is: "=",
    "<": "<",
    lt: "<",
    before: "<",
    "<=": "<=",
    "=<": "<=",
    lte: "<=",
    ">": ">",
    gt: ">",
    after: ">",
    ">=": ">=",
    "=>": ">=",
    gte: ">=",
    within: "within",
    between: "within",
    range: "within",
  };
  return map[s] || null;
}

function toValues(clause) {
  let values = clause?.values ?? clause?.value;
  if (values === undefined || values === null) {
    return [];
  }
  if (!Array.isArray(values)) {
    values = [values];
  }
  return values
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .filter((v) => v !== null && v !== undefined && v !== "")
    .map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v)))
    .slice(0, MAX_VALUES_PER_CLAUSE);
}

/**
 * Splits a `within` value into its two bounds. Accepts "2015 2020",
 * "2015-2020", "2015..2020", "2015 to 2020", or two separate values.
 */
function withinBounds(values, normalizeFn) {
  let parts = [];
  if (values.length >= 2) {
    parts = values.slice(0, 2);
  } else if (values.length === 1) {
    parts = String(values[0])
      .split(/\s*(?:\.\.|–|—|\bto\b|\btil\b|\bog\b|,|;)\s*|\s+-\s+|\s+/i)
      .filter(Boolean);
    if (parts.length === 1 && /^\d{4}-\d{4}$/.test(parts[0])) {
      parts = parts[0].split("-");
    }
  }
  if (parts.length !== 2) {
    return null;
  }
  const a = normalizeFn(parts[0]);
  const b = normalizeFn(parts[1]);
  if (!a || !b) {
    return null;
  }
  // NOW arithmetic is not allowed inside within, only plain NOW / years
  if (/ /.test(a) || / /.test(b)) {
    return null;
  }
  return [a, b];
}

/**
 * Builds `index op value` (or a value group) for a list of already
 * formatted values.
 */
function joinValues(index, op, formatted) {
  if (formatted.length === 1) {
    return index ? `${index}${spaced(op)}${formatted[0]}` : formatted[0];
  }
  const group = `(${formatted.join(" OR ")})`;
  if (!index) {
    return group;
  }
  if (op === "=") {
    // value-list shorthand: phrase.subject=("a" OR "b")
    return `${index}=${group}`;
  }
  return `(${formatted.map((v) => `${index}${spaced(op)}${v}`).join(" OR ")})`;
}

function spaced(op) {
  return op === "=" ? "=" : ` ${op} `;
}

/**
 * Compiles one clause.
 *
 * @param {Object} clause
 * @param {Object} [options]
 * @param {Object} [options.vocab] vocab.json-shaped object (tests)
 * @param {Object} [options.fields] field registry (v4 narrows it, see src/lib/aiCql/v4/indexes.js)
 * @param {Object} [options.fieldAliases] alias table matching `fields`
 * @returns {{ cql: string|null, negate: boolean, resolutions: Array, warnings: string[] }}
 */
export function compileClause(
  clause,
  { vocab, fields = FIELDS, fieldAliases = FIELD_ALIASES } = {}
) {
  const warnings = [];
  const resolutions = [];
  const negate = clause?.negate === true || clause?.not === true;
  const rawField = clause?.field ?? clause?.index ?? "default";
  let field = normalizeFieldName(rawField, {
    fields,
    aliases: fieldAliases,
  });

  if (!field) {
    warnings.push(`Unknown field "${rawField}" → searched in default index`);
    field = "default";
  }
  const def = fields[field];

  let op = normalizeOp(clause?.op);
  if (!op) {
    warnings.push(`Unknown operator "${clause?.op}" on ${field} → "="`);
    op = "=";
  }
  if (!def.ops.includes(op)) {
    warnings.push(`Operator "${op}" not allowed on ${field} → "="`);
    op = "=";
  }

  const values = toValues(clause);
  if (!values.length) {
    warnings.push(`Clause on ${field} has no value → dropped`);
    return { cql: null, negate, resolutions, warnings };
  }

  const bare = (name) => name;
  const term = (name) => `term.${name}`;
  const phrase = (name) => `phrase.${name}`;

  switch (def.kind) {
    case KIND.YEAR:
    case KIND.NUMBER: {
      const normalizeFn =
        def.kind === KIND.YEAR ? normalizeYearValue : normalizeNumberValue;
      if (op === "within") {
        const bounds = withinBounds(values, normalizeFn);
        if (!bounds) {
          warnings.push(
            `Bad range "${values.join(" ")}" on ${field} → clause dropped`
          );
          return { cql: null, negate, resolutions, warnings };
        }
        return {
          cql: `${field} within ${quote(bounds.join(" "))}`,
          negate,
          resolutions,
          warnings,
        };
      }
      const formatted = values.map(normalizeFn).filter(Boolean);
      if (!formatted.length) {
        warnings.push(
          `Value "${values.join(
            ", "
          )}" is not valid for ${field} → clause dropped`
        );
        return { cql: null, negate, resolutions, warnings };
      }
      return {
        cql: joinValues(bare(field), op, [...new Set(formatted)]),
        negate,
        resolutions,
        warnings,
      };
    }

    case KIND.BOOLEAN: {
      const v = normalize(values[0]);
      const truthy = ["true", "1", "yes", "ja", "y"].includes(v);
      const falsy = ["false", "0", "no", "nej", "n"].includes(v);
      if (!truthy && !falsy) {
        warnings.push(`"${values[0]}" is not boolean for ${field} → true`);
      }
      const index = def.families.includes("term") ? term(field) : bare(field);
      return {
        cql: `${index}=${falsy ? "false" : "true"}`,
        negate,
        resolutions,
        warnings,
      };
    }

    case KIND.ENUM: {
      const formatted = [];
      for (const raw of values) {
        const n = normalize(raw);
        let match = def.values.find((v) => normalize(v) === n);
        if (!match && def.aliases?.[n]) {
          match = def.aliases[n];
        }
        if (!match) {
          // last resort: fuzzy against the tiny enum
          match = def.values.find(
            (v) => normalize(v).startsWith(n) || n.startsWith(normalize(v))
          );
        }
        if (!match) {
          warnings.push(`"${raw}" is not a legal value for ${field} → dropped`);
          continue;
        }
        if (normalize(match) !== n) {
          resolutions.push({ field, input: raw, value: match, method: "enum" });
        }
        formatted.push(def.unquoted ? match : quote(match));
      }
      if (!formatted.length) {
        return { cql: null, negate, resolutions, warnings };
      }
      const index = def.families.includes("bare")
        ? bare(field)
        : def.families.includes("term")
        ? term(field)
        : phrase(field);
      return {
        cql: joinValues(index, "=", [...new Set(formatted)]),
        negate,
        resolutions,
        warnings,
      };
    }

    case KIND.IDENTIFIER: {
      const formatted = values
        .map((v) => sanitizeText(v).replace(/\*$/, ""))
        .filter(Boolean)
        .map(quote);
      if (!formatted.length) {
        return { cql: null, negate, resolutions, warnings };
      }
      const index = def.families.includes("bare") ? bare(field) : term(field);
      return {
        cql: joinValues(index, "=", [...new Set(formatted)]),
        negate,
        resolutions,
        warnings,
      };
    }

    case KIND.CONTROLLED: {
      const hasPhrase = def.families.includes("phrase");
      const hasTerm = def.families.includes("term");
      const byIndex = new Map();
      for (const raw of values) {
        const cleaned = sanitizeText(raw);
        if (!cleaned) {
          continue;
        }
        const r = resolveValue(def.vocab, cleaned, { vocab });
        let index;
        let value;
        if (r.trusted && (r.exact || r.wildcard) && hasPhrase) {
          index = phrase(field);
          value = r.wildcard ? `${r.value}*` : r.value;
        } else if (r.method === "none" && def.unresolved && isTrusted(vocab)) {
          // Closed vocabulary and the value is not in it (e.g. a city name in
          // "setting"): the value is about something else, so search it where
          // it can actually match instead of guaranteeing zero hits.
          index = def.unresolved === "default" ? "" : term(def.unresolved);
          value = r.value.replace(/\*$/, "");
          r.method = "rerouted";
        } else if (hasTerm) {
          // unknown value: tokenized term.* search has the best recall
          index = term(field);
          value = r.value.replace(/\*$/, "");
        } else {
          // phrase-only field with an unknown value: best effort wildcard
          index = phrase(field);
          value = `${r.value.replace(/\*$/, "")}*`;
        }
        if (r.method !== "none" || normalize(cleaned) !== normalize(value)) {
          resolutions.push({
            field,
            input: cleaned,
            value: index ? `${index}=${value}` : `"${value}"`,
            method: r.method,
            ...(r.candidates ? { candidates: r.candidates.slice(0, 5) } : {}),
            ...(r.similarity ? { similarity: r.similarity } : {}),
          });
        }
        if (!byIndex.has(index)) {
          byIndex.set(index, []);
        }
        if (!byIndex.get(index).includes(value)) {
          byIndex.get(index).push(value);
        }
      }
      if (!byIndex.size) {
        warnings.push(`Clause on ${field} has no usable value → dropped`);
        return { cql: null, negate, resolutions, warnings };
      }
      const parts = [...byIndex.entries()].map(([index, vals]) =>
        joinValues(index || null, "=", vals.map(quote))
      );
      return {
        cql: parts.length === 1 ? parts[0] : `(${parts.join(" OR ")})`,
        negate,
        resolutions,
        warnings,
      };
    }

    case KIND.DEFAULT: {
      const formatted = [
        ...new Set(values.map(sanitizeText).filter(Boolean).map(quote)),
      ];
      if (!formatted.length) {
        return { cql: null, negate, resolutions, warnings };
      }
      return {
        cql: joinValues(null, "=", formatted),
        negate,
        resolutions,
        warnings,
      };
    }

    case KIND.TEXT:
    default: {
      const formatted = [
        ...new Set(values.map(sanitizeText).filter(Boolean).map(quote)),
      ];
      if (!formatted.length) {
        warnings.push(`Clause on ${field} has no usable value → dropped`);
        return { cql: null, negate, resolutions, warnings };
      }
      return {
        cql: joinValues(term(field), "=", formatted),
        negate,
        resolutions,
        warnings,
      };
    }
  }
}

/**
 * Compiles a whole AST into CQL.
 *
 * @param {Object} ast
 * @param {Object} [options]
 * @param {Object} [options.vocab] vocab.json-shaped object (tests)
 * @param {Object} [options.fields] field registry (defaults to the v3 registry)
 * @param {Object} [options.fieldAliases] alias table matching `fields`
 * @returns {{ cql: string|null, warnings: string[], resolutions: Array, clauses: Array }}
 */
export function compile(
  ast,
  { vocab, fields = FIELDS, fieldAliases = FIELD_ALIASES } = {}
) {
  const warnings = [];
  const resolutions = [];
  const positives = [];
  const negatives = [];
  const compiled = [];

  const rawClauses = Array.isArray(ast?.clauses)
    ? ast.clauses
    : Array.isArray(ast)
    ? ast
    : [];

  if (rawClauses.length > MAX_CLAUSES) {
    warnings.push(
      `Too many clauses (${rawClauses.length}) → first ${MAX_CLAUSES} used`
    );
  }

  for (const clause of rawClauses.slice(0, MAX_CLAUSES)) {
    if (!clause || typeof clause !== "object") {
      warnings.push("Ignored non-object clause");
      continue;
    }
    const c = compileClause(clause, { vocab, fields, fieldAliases });
    warnings.push(...c.warnings);
    resolutions.push(...c.resolutions);
    if (!c.cql) {
      continue;
    }
    compiled.push({ cql: c.cql, negate: c.negate });
    (c.negate ? negatives : positives).push(c.cql);
  }

  if (!positives.length) {
    if (negatives.length) {
      warnings.push("Only negated clauses → no query");
    }
    return { cql: null, warnings, resolutions, clauses: compiled };
  }

  const combine =
    String(ast?.combine ?? "AND").toUpperCase() === "OR" ? "OR" : "AND";
  const uniquePositives = [...new Set(positives)];
  let cql = uniquePositives.join(` ${combine} `);

  if (negatives.length) {
    if (combine === "OR" && uniquePositives.length > 1) {
      cql = `(${cql})`;
    }
    for (const n of [...new Set(negatives)]) {
      cql += ` NOT ${n}`;
    }
  }

  return { cql, warnings, resolutions, clauses: compiled };
}

/**
 * Deterministic fallback when the model output is unusable: the whole prompt
 * as one quoted term in the default index.
 *
 * @param {string} prompt
 * @returns {string|null}
 */
export function fallbackCql(prompt) {
  const cleaned = sanitizeText(prompt).replace(/\*$/, "");
  return cleaned ? quote(cleaned) : null;
}

export { RANGE_OPS };

// utils/searchHelpers.js

/**
 * Safely extracts q.all (string) from a fieldSearch JSON shape.
 * @param {string|object|null|undefined} fieldSearch
 * @returns {string} extracted value or empty string
 */
export function extractAllFromFieldSearch(fieldSearch) {
  try {
    const obj =
      typeof fieldSearch === "string" ? JSON.parse(fieldSearch) : fieldSearch;
    const field = obj?.inputFields?.[0];
    if (field?.searchIndex === "term.default") return field.value || "";
    return "";
  } catch {
    return "";
  }
}

/**
 * Builds a minimal fieldSearch JSON string from a q.all value.
 * @param {string|null|undefined} all
 * @returns {string|undefined} JSON string or undefined
 */
export function buildFieldSearchFromAll(all) {
  if (!all) return undefined;
  return JSON.stringify({
    inputFields: [
      {
        value: all,
        prefixLogicalOperator: null,
        searchIndex: "term.default",
      },
    ],
  });
}

/**
 * Removes a single pair of outer quotes from a string, e.g. `"Horse"` -> `Horse`.
 * Inner quotes remain intact.
 * @param {string} s
 * @returns {string}
 */
export function stripOuterQuotes(s) {
  if (typeof s !== "string") return s;
  return s.replace(/^"(.*)"$/, "$1");
}

/**
 * Returns true if the value is nullish, empty array, or trimmed empty string.
 * @param {any} v
 * @returns {boolean}
 */
export function isEmptyVal(v) {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  return `${v}`.trim() === "";
}

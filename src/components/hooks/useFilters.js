/**
 * Hook for filter sync across components 🤯
 *
 * OBS! useFilters hook is SWR connected and will trigger an update
 * on connected components.
 */

import { useEffect } from "react";
import { useRouter } from "next/router";

import useSWR from "swr";

const URL_FACET_DELIMITER = ",";
const DELIMITER_ENCODING = "__";

const URL_FACET_DELIMITER_REGEX = new RegExp(URL_FACET_DELIMITER, "g");
const DELIMITER_ENCODING_REGEX = new RegExp(DELIMITER_ENCODING, "g");

/**
 *
 * Settings
 *
 *
 */

// Global state
let locale = {};

// Global useFilters hook initialization
let initialized = false;

// Custom fetcher
const fetcher = () => locale;

// current supported filter types
export const types = [
  "materialType",
  "accessType",
  "subject",
  "creator",
  "fictionNonfiction",
  "language",
  "genre",
  "audience",
  "fictiveCharacter",
  "workType",
];

// Visible Worktypes for work type selections
export const workTypes = [
  "literature",
  "article",
  "movie",
  "game",
  "music",
  "sheetmusic",
];

// Included categories/facets by selected workType
// This list works as a sorted whitelist
export const includedTypes = {
  literature: [
    "materialType",
    "accessType",
    "subject",
    "creator",
    "fictionNonfiction",
    "language",
    "genre",
    "audience",
    "fictiveCharacter",
  ],
  article: ["materialType", "accessType", "subject", "creator", "language"],
  movie: [
    "materialType",
    "accessType",
    "subject",
    "creator",
    "language",
    "genre",
    "audience",
    "fictiveCharacter",
  ],
  game: ["materialType", "accessType", "genre", "audience", "fictiveCharacter"],
  music: ["materialType", "accessType", "creator", "genre", "audience"],
  sheetmusic: ["materialType", "accessType", "subject", "creator", "genre"],
};

/**
 *
 *
 *
 *
 */

/**
 * function to build the default (empty) filters object
 *
 * @returns {object}
 */

export function buildFilters() {
  const params = {};
  types.forEach((type) => (params[type] = []));
  return params;
}

/**
 * Get filters from query params
 *
 * @param {object} query (defaults to router.query)
 *
 * @returns {object}
 *
 */
export function getQuery(query) {
  const base = buildFilters();

  const filters = {};
  Object.entries(query).forEach(([key, val]) => {
    if (types.includes(key) && val) {
      filters[key] =
        val &&
        val
          .split(URL_FACET_DELIMITER)
          .map((v) => v.replace(DELIMITER_ENCODING_REGEX, URL_FACET_DELIMITER));
    }
  });

  return { ...base, ...filters };
}

/**
 * useFilters hook
 *
 * @returns {object}
 *
 * filters
 * setFilters
 * getQuery
 * setQuery
 * getCount
 * types
 * workTypes
 *
 */

function useFilters() {
  // router
  const router = useRouter();

  // SWR
  const { data: _filters, mutate: _setFilters } = useSWR("filters", fetcher, {
    initialData: buildFilters(),
  });

  // represent all filters: All type names as key and empty array as value
  const base = buildFilters();

  /**
   * Restore filters and query from query params
   */
  useEffect(() => {
    const q = _getQuery();
    const initQuery = JSON.stringify(q);
    if (initialized !== initQuery) {
      // set initialized to initQuery, this prevents multiple mount call (multiple instances of hook)
      initialized = initQuery;
      // set locale object
      locale = q;
      // update locale state (swr)
      _setFilters(locale);
    }
  }, [router.query]);

  /**
   * Update locale filters
   *
   * @param {object} include
   *
   */
  const setFilters = (include = {}) => {
    const params = {};
    Object.entries(include).forEach(([key, val]) => {
      if (types.includes(key)) {
        params[key] = val;
      }
    });

    // set locale object
    locale = { ...base, ...params };

    // update locale state (swr)
    _setFilters(locale);
  };

  /**
   * Get filters from query params
   *
   * @param {object} query (defaults to router.query)
   *
   * @returns {object}
   *
   */
  const _getQuery = (query = router.query) => getQuery(query);

  /**
   * Set filters in query params
   *
   * @param {object} include
   * @param {array} exclude
   */
  const setQuery = ({ include = _filters, exclude = [] }) => {
    /**
     * ensure all filters is represented, if not, the router update
     * can get messed up by not removing all non-represented filters.
     */
    include = { ...base, ...include };

    const params = {};
    // include
    Object.entries(include).forEach(([key, val]) => {
      if (types.includes(key)) {
        params[key] = val
          .map((v) => v.replace(URL_FACET_DELIMITER_REGEX, DELIMITER_ENCODING))
          .join(URL_FACET_DELIMITER);
      }
    });

    // query params
    const query = { ...router.query };

    // merge current query params and new filters
    const merged = { ...query, ...params };

    // remove empty params
    Object.entries(merged).forEach(([key, val]) => {
      if (val === "") {
        delete merged[key];
      }
    });

    // exclude tags from query
    exclude.forEach((param) => delete merged[param]);

    // update router
    router &&
      router.push(
        {
          pathname: router.pathname,
          query: merged,
        },
        undefined,
        { scroll: router.pathname === "/find" ? false : true }
      );
  };

  /**
   * Count active filters in query (!OBS: Query filters only)
   *
   * @param exclude params
   *
   * @returns {int}
   */
  function getCount(exclude = []) {
    const filters = _getQuery();

    let count = 0;
    Object.entries(filters).map(([key, value]) => {
      // exluded keys
      if (!exclude.includes(key)) {
        // if there is an actual value
        if (value.length > 0) {
          value.forEach(() => count++);
        }
      }
    });

    return count;
  }

  return {
    filters: _filters,
    setFilters,
    getQuery: _getQuery,
    setQuery,
    getCount,
    types,
    workTypes,
  };
}

export default useFilters;

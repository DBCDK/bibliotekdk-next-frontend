/**
 * Hook for filter sync across components
 *
 * OBS! useFilters hook is SWR connected and will trigger an update
 * on connected components.
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

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

// included categories/facets by selected workType
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
  ],
  game: ["materialType", "accessType", "genre", "audience"],
  music: ["accessType", "creator", "genre", "audience"],
  sheetmusic: ["materialType", "accessType", "subject", "creator", "genre"],
};

// Global state
let locale = {};

// Custom fetcher
const fetcher = () => locale;

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
      filters[key] = val && val.split(",");
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
   * Restore filters by query params
   *
   */
  useEffect(() => {
    if (router) {
      // set locale object
      locale = _getQuery();
      // update locale state (swr)
      _setFilters(locale);
    }
  }, []);

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
  const setQuery = (include = _filters, exclude = []) => {
    /**
     * ensure all filters is represented, if not, the router update
     * can get messed up by not removing all non-represented filters.
     */
    include = { ...base, ...include };

    const params = {};
    // include
    Object.entries(include).forEach(([key, val]) => {
      if (types.includes(key)) {
        params[key] = val.join();
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
      router.push({
        pathname: router.pathname,
        query: merged,
      });
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

/**
 * Hook for q search param sync across components 🤯
 *
 * OBS! useQ hook is SWR connected and will trigger an update
 * on connected components.
 */

import { useEffect } from "react";
import { useRouter } from "next/router";

import useSWR from "swr";

/**
 *
 * Settings
 *
 *
 */

// Global state
let locale = {};

// Global useQ hook initialization
let initialized = false;

// Custom fetcher
const fetcher = () => locale;

// current supported filter types
export const types = ["all", "creator", "subject", "title"];

/**
 * function to build the default (empty) q object
 *
 * @returns {object}
 */

export function buildQ() {
  return {};

  const params = {};
  types.forEach((type) => (params[type] = ""));
  return params;
}

/**
 * Get all q types from query params
 *
 * @param {object} query (defaults to router.query)
 *
 * @returns {object}
 *
 */
export const getQuery = (query = {}) => {
  const base = buildQ();

  const params = {};
  Object.entries(query).forEach(([key, val]) => {
    // strip q keys to match types
    key = key.replace("q.", "");
    if (types.includes(key) && val) {
      params[key] = val;
    }
  });

  return { ...base, ...params };
};

/**
 * useQ hook
 *
 * @returns {object}
 *
 * setQuery
 * getQuery
 * hasQuery
 * types
 *
 */

function useQ() {
  // router
  const router = useRouter();

  // SWR
  const { data: _q, mutate: _setQ } = useSWR("q", fetcher, {
    initialData: buildQ(),
  });

  // represent all q: All type names as key and empty array as value
  const base = buildQ();

  /**
   * Restore q from query params
   */
  useEffect(() => {
    const q = _getQuery();
    const initQuery = JSON.stringify(q);

    console.log("useQ => useEffect", {
      q,
      initQuery,
      initialized,
      equal: initialized === initQuery,
    });

    if (initialized !== initQuery) {
      // set initialized to initQuery, this prevents multiple mount call (multiple instances of hook)
      initialized = initQuery;
      // set locale object
      locale = q;
      // update locale state (swr)
      _setQ(locale);
    }
  }, [router.query]);

  /**
   * Update the locale q
   *
   * @param {object} include
   *
   */
  const setQ = (include = {}) => {
    console.log("useQ => setQ => include", include);

    const params = {};
    Object.entries(include).forEach(([key, val]) => {
      // strip q keys to match types
      key = key.replace("q.", "");
      if (types.includes(key)) {
        params[key] = val;
      }
    });

    // set locale object
    locale = { ...base, ...params };

    console.log("useQ => setQ => locale", locale);

    // update locale state (swr)
    _setQ(locale);
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
   * Set q types in query params
   *
   * @param {object} include
   * @param {array} exclude
   */
  const setQuery = ({ include = _q, exclude = [] }) => {
    /**
     * ensure all filters is represented, if not, the router update
     * can get messed up by not removing all non-represented filters.
     */
    include = { ...base, ...include };

    const params = {};
    // include
    Object.entries(include).forEach(([key, val]) => {
      if (types.includes(key)) {
        params[`q.${key}`] = val;
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
   * Boolean to check if q contains a value
   */
  const obj = _getQuery();
  const _hasQuery = !!(obj.all || obj.creator || obj.title || obj.subject);

  return {
    // functions
    setQ,
    getQuery: _getQuery,
    setQuery,
    // constants
    q: _q,
    hasQuery: _hasQuery,
    types,
  };
}

export default useQ;

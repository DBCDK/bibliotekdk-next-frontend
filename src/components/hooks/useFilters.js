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
const types = [
  "accessType",
  "audience",
  "creator",
  "fictionNonfiction",
  "fictiveCharacter",
  "genre",
  "language",
  "materialType",
  "subject",
  "workType",
];

// Global state
let locale = {};

// Custom fetcher
const fetcher = () => locale;

/**
 * function to build the default (empty) filters object
 *
 * @returns {object}
 */

function buildFilters() {
  const params = {};
  types.forEach((type) => (params[type] = []));
  return params;
}

function useFilters() {
  // router
  const router = useRouter();
  // SWR
  const { data: _filters, mutate: _setFilters } = useSWR("filters", fetcher, {
    initialData: buildFilters(),
  });

  const base = buildFilters();

  /**
   * Restore filters by query params
   *
   */
  useEffect(() => {
    if (router) {
      // set locale object
      locale = getQuery();
      // update locale state (swr)
      _setFilters(locale);
    }
  }, []);

  /**
   * Update locale filters
   *
   * @param filters
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
   * @param exclude params
   *
   */
  const getQuery = () => {
    const filters = {};
    Object.entries(router.query).forEach(([key, val]) => {
      if (types.includes(key) && val) {
        filters[key] = val && val.split(",");
      }
    });

    return { ...base, ...filters };
  };

  /**
   * Set filters in query params
   *
   * @param exclude params
   *
   */
  const setQuery = (exclude = []) => {
    /**
     * ensure all filters is represented, if not, the router update
     * can get messed up by not removing all non-represented filters.
     */
    const include = { ...base, ..._filters };

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
      console.log("val", val);

      if (val.length === 0 || val === "") {
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

  return { filters: _filters, setFilters, getQuery, setQuery, types };
}

export default useFilters;

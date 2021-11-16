/**
 * Hook for filter sync cross components
 *
 * OBS! useFilters hook is SWR connected and will trigger an update
 * on all connected components.
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

// current supported filters
const allFilters = [
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

function useFilters() {
  // router
  const router = useRouter();
  // SWR
  const { data: _filters, mutate: _setFilters } = useSWR("filters", fetcher, {
    initialData: {},
  });

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
      if (allFilters.includes(key)) {
        console.log("setFilters => val", val);

        params[key] = val;
      }
    });

    // set locale object
    locale = params;

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
      if (allFilters.includes(key) && val) {
        filters[key] = val && val.split(",");
      }
    });
    return filters;
  };

  /**
   * Set filters in query params
   *
   * @param exclude params
   *
   */
  const setQuery = (exclude = []) => {
    const include = _filters;
    const params = {};
    // include
    Object.entries(include).forEach(([key, val]) => {
      if (allFilters.includes(key)) {
        params[key] = val.join();
      }
    });

    // exclude tags
    const copy = { ...router.query };
    exclude.forEach((param) => delete copy[param]);

    // update router
    router &&
      router.push({
        pathname: router.pathname,
        query: {
          ...copy,
          ...params,
        },
      });
  };

  return { filters: _filters, setFilters, getQuery, setQuery };
}

export default useFilters;

/**
 * Hook for getting constants and function for use when filtering on worktype
 */

import { useRouter } from "next/router";

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

function useFilters() {
  const router = useRouter();

  /**
   * Filters from query
   *
   * @returns {object}
   */
  const filters = {};
  router &&
    Object.entries(router.query).forEach(([key, val]) => {
      if (allFilters.includes(key)) {
        filters[key] = [val];
      }
    });

  /**
   * Updates filters in router
   *
   */
  const setFilters = (filters) => {
    const params = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (allFilters.includes(key)) {
        params[key] = val.join();
      }
    });

    console.log("setFilters => params", params);

    false &&
      router &&
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          ...params,
        },
      });
  };

  return [filters, setFilters];
}

export default useFilters;

/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

import { types } from "@/components/hooks/useFilters";

/**
 * Hitcount
 *
 * @param {object} params
 * @param {string} params.q the query
 */
export function hitcount({ q, filters = {} }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $filters: SearchFilters) {
              search(q: {all: $q}, filters: $filters) {
                hitcount
              }
              monitor(name: "bibdknext_search_hitcount")
            }`,
    variables: { q, filters },
    slowThreshold: 3000,
  };
}

/**
 * Fast search
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function fast({ q, limit, offset, filters = {} }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $filters: SearchFilters, $offset: Int!, $limit: PaginationLimit!) {
              search(q: {all: $q}, filters: $filters) {
                works(limit: $limit, offset: $offset) {
                  id
                  title
                  creators {
                    name
                  }
                }
                hitcount
              }
              monitor(name: "bibdknext_search_fast")
            }`,
    variables: {
      q,
      limit,
      offset,
      filters,
    },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function all({ q, limit, offset, filters = {} }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $filters: SearchFilters, $offset: Int!, $limit: PaginationLimit!) {
              search(q: {all: $q}, filters: $filters) {
                works(limit: $limit, offset: $offset) {
                  id
                  cover {
                    detail
                  }
                  creators {
                    name
                  }
                  materialTypes {
                    materialType
                  }
                  path
                  title
                }
                hitcount
              }
              monitor(name: "bibdknext_search_all")
            }`,
    variables: {
      q,
      limit,
      offset,
      filters,
    },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function facets({ q, filters = {}, facets = types }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $filters: SearchFilters, $facets: [FacetField!]!) {
              search(q: {all: $q}, filters: $filters) {
                facets(facets: $facets) {
                  name
                  values(limit: 100) {
                    term
                    key
                    count
                  }
                }
              }
              monitor(name: "bibdknext_search_facets")
            }`,
    variables: {
      q,
      filters,
      facets,
    },
    slowThreshold: 3000,
  };
}

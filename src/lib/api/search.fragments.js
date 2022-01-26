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
    query: `query ($q: SearchQuery!, $filters: SearchFilters) {
<<<<<<< HEAD
              search(q: $q, filters: $filters) {
                hitcount
              }
              monitor(name: "bibdknext_search_hitcount")
            }`,
=======
               search(q: $q, filters: $filters) {
                 hitcount
               }
               monitor(name: "bibdknext_search_hitcount")
             }`,
>>>>>>> 967a3423ec1468472f1987235b3a29abf950dad5
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
export function fast({ q, limit = 100, offset = 0, filters = {} }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: SearchQuery!, $filters: SearchFilters, $offset: Int!, $limit: PaginationLimit!) {
<<<<<<< HEAD
              search(q: $q, filters: $filters) {
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
=======
               search(q: $q, filters: $filters) {
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
>>>>>>> 967a3423ec1468472f1987235b3a29abf950dad5
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
export function all({ q, limit = 100, offset = 0, filters = {} }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: SearchQuery!, $filters: SearchFilters, $offset: Int!, $limit: PaginationLimit!) {
<<<<<<< HEAD
              search(q: $q, filters: $filters) {
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
=======
               search(q: $q, filters: $filters) {
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
>>>>>>> 967a3423ec1468472f1987235b3a29abf950dad5
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
    query: `query ($q: SearchQuery!, $filters: SearchFilters, $facets: [FacetField!]!) {
<<<<<<< HEAD
              search(q: $q, filters: $filters) {
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
=======
               search(q: $q, filters: $filters) {
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
>>>>>>> 967a3423ec1468472f1987235b3a29abf950dad5
    variables: {
      q,
      filters,
      facets,
    },
    slowThreshold: 3000,
  };
}

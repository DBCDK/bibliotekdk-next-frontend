/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

/**
 * Hitcount
 *
 * @param {object} params
 * @param {string} params.q the query
 */
export function hitcount({ q, facets = null }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String! ${facets ? `, $facets: [FacetFilter]` : ""}) {
        search(q: $q, limit: 10, offset: 0 ${
          facets ? `, facets: $facets` : ""
        }) {
          hitcount
        }
        monitor(name: "bibdknext_search_hitcount")
      }`,
    variables: { q, facets },
    slowThreshold: 3000,
  };
}

/**
 * Fast search
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function fast({ q, limit, offset, facets = null }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $limit: PaginationLimit!, $offset: Int ${
      facets ? `, $facets: [FacetFilter]` : ""
    }) {
        search(q: $q, limit: $limit, offset: $offset ${
          facets ? `, facets: $facets` : ""
        }) {
          result {
            title
            creator {
              name
            }
          }
          hitcount
        }
        monitor(name: "bibdknext_search_fast")
      }`,
    variables: { q, limit, offset, facets },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function all({ q, limit, offset, facets = null }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $limit: PaginationLimit!, $offset: Int ${
      facets ? `, $facets: [FacetFilter]` : ""
    }) {
        search(q: $q, limit: $limit, offset: $offset ${
          facets ? `, facets: $facets` : ""
        }) {
          result {
            title
            work {
              cover {
                detail
              }
              creators {
                name
              }
              id,
              materialTypes {
                materialType
              }
              path
              title
            }
          }
          hitcount
        }
        monitor(name: "bibdknext_search_all")
      }`,
    variables: { q, limit, offset, facets },
    slowThreshold: 3000,
  };
}

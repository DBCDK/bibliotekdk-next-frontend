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
export function hitcount({ q }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!) {
        search(q: $q, limit: 10, offset: 0) {
          hitcount
        }
        monitor(name: "bibdknext_search_hitcount")
      }`,
    variables: { q },
    slowThreshold: 3000,
  };
}

/**
 * Fast search
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function fast({ q, limit, offset }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $limit: PaginationLimit!, $offset: Int) {
        search(q: $q, limit: $limit, offset: $offset) {
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
    variables: { q, limit, offset },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function all({ q, limit, offset }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $limit: PaginationLimit!, $offset: Int) {
        search(q: $q, limit: $limit, offset: $offset) {
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
    variables: { q, limit, offset },
    slowThreshold: 3000,
  };
}

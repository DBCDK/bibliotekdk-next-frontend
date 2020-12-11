/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

/**
 * Fast search
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function fast({ q }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!) {
        search(q: $q) {
          result {
            title
            creator {
              name
            }
          }
        }
        monitor(name: "bibdknext_search_fast")
      }`,
    variables: { q },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function all({ q }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!) {
        search(q: $q) {
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
        }
        monitor(name: "bibdknext_search_all")
      }`,
    variables: { q },
    slowThreshold: 3000,
  };
}

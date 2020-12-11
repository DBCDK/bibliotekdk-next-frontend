/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.q the query string
 */
export function all({ q }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!) {
        suggest(q: $q) {
          result {
            __typename
            ... on Creator {
              name
              imageUrl
            }
            ... on Subject {
              value
            }
            ... on Work {
              title
              cover {
                thumbnail
              }
            }
          }
        }
        monitor(name: "bibdknext_suggest_all")
      }`,
    variables: { q },
    slowThreshold: 3000,
  };
}

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
export function fast({ q, worktype }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String! $worktype:WorkType) {
        suggest(q: $q worktype:$worktype) {
          result {
            __typename
            ... on Creator {
              name
            }
            ... on Subject {
              value
            }
            ... on Work {
              title
            }
          }
        }
        monitor(name: "bibdknext_suggest_all")
      }`,
    variables: { q, worktype },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.q the query string
 */
export function all({ q, worktype }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String! $worktype:WorkType) {
        suggest(q: $q worktype:$worktype) {
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
              id
              title
              cover {
                thumbnail
              }
              creators {
                name
              }
            }
          }
        }
        monitor(name: "bibdknext_suggest_all")
      }`,
    variables: { q, worktype },
    slowThreshold: 3000,
  };
}

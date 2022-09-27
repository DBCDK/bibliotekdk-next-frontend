/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

import { ApiEnums } from "@/lib/api/api";

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.q the query string
 */
export function fast({ q, workType: workTypeLowerCase }) {
  const workType = workTypeLowerCase?.toUpperCase();

  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ($q: String!, $workType: WorkType) {
      suggest(q: $q, workType: $workType) {
        result {
          type
          term
        }
      }
      monitor(name: "bibdknext_suggest_all")
    }`,
    variables: { q, workType },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.q the query string
 */
export function all({
  q,
  workType: workTypeLowerCase,
  suggestType: suggestTypeLowerCase = "",
  limit = 100000,
}) {
  const workType = workTypeLowerCase?.toUpperCase();
  const suggestType = suggestTypeLowerCase?.toUpperCase();
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ($q: String!, $workType: WorkType, $limit: Int) {
      suggest(q: $q, workType: $workType, limit: $limit) {
        result {
          type
          term
          work {
            __typename
            workId
            creators {
              display
              nameSort
            }
            subjects {
              all {
                ... on SubjectText {
                  type
                }
              }
            }
            manifestations {
              latest {
                cover {
                  thumbnail
                }
              }
            }
          }
        }
      }
      monitor(name: "bibdknext_suggest_all")
    }`,
    variables: { q, workType, suggestType, limit },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {object} params
 * @param {string} params.q the query string
 */
export function typedSuggest({
  q,
  workType: workTypeLowerCase,
  suggestType: suggestTypeLowerCase = "",
  limit = 100000,
}) {
  const workType = workTypeLowerCase?.toUpperCase();
  const suggestType = suggestTypeLowerCase?.toUpperCase();
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ($q: String!, $workType: WorkType, $suggestType: SuggestionType, $limit: Int) {
      suggest(q: $q, workType: $workType, suggestType: $suggestType, limit: $limit) {
        result {
          type
          term
          work {
            __typename
            workId
            creators {
              display
              nameSort
            }
            subjects {
              all {
                ... on SubjectText {
                  type
                }
              }
            }
            manifestations {
              latest {
                cover {
                  thumbnail
                }
              }
            }
          }
        }
      }
      monitor(name: "bibdknext_suggest_all")
    }`,
    variables: { q, workType, suggestType, limit },
    slowThreshold: 3000,
  };
}

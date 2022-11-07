import { ApiEnums } from "@/lib/api/api";

/**
 * fiction inspiration
 *
 * @param {object} params
 * @param {string} params.limit
 */
export function fiction({ limit = 10, filters } = {}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($limit: Int!, $filters: [String!]) {
        inspiration {
          categories {
            fiction(filters: $filters) {
              title
              works(limit: $limit) {
                workId
                titles {
                  main
                }
                creators {
                  display
                }
                manifestations {
                  all {
                    cover {
                      detail
                    }
                  }
                }
              }
            }
          }
        }
      }`,
    variables: {
      limit,
      filters,
    },
    slowThreshold: 3000,
  };
}

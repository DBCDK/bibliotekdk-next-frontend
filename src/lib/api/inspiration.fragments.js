import { ApiEnums } from "@/lib/api/api";

/**
 * fiction inspiration
 *
 * @param {object} params
 * @param {string} params.limit
 */
export function fiction({ limit = 10 } = {}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($limit: Int!) {
        inspiration {
          categories {
            fiction {
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
                  latest {
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
    },
    slowThreshold: 3000,
  };
}

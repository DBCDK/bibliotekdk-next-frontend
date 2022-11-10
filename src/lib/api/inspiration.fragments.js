import { ApiEnums } from "@/lib/api/api";

const CATEGORY_ENUMS = [
  "childrenBooksNonfiction",
  "childrenBooksFiction",
  "fiction",
  "nonfiction",
  "eBooks",
  "articles",
  "movies",
  "games",
  "music",
  "sheetMusic",
];

/**
 * fiction inspiration
 *
 * @param {object} params
 * @param {string} params.limit
 */

export function inspiration({ limit = 10, filters, category } = {}) {
  // ensure valid category
  if (!CATEGORY_ENUMS.includes(category)) {
    return null;
  }

  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($limit: Int!, $filters: [String!]) {
        inspiration {
          categories {
            ${category}(filters: $filters) {
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

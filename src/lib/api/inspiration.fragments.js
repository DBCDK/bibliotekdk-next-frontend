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
 * inspiration
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
              result(limit: $limit) {
                work {
                  workId
                  titles {
                    main
                  }
                  creators {
                    display
                  }
                }
                manifestation {
                  materialTypes {
                    specific
                  }
                  cover {
                    detail
                    origin
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

/**
 * inspiration categories for a category
 *
 * @param {object} params
 * @param {string} params.limit
 */

export function categories({ filters = [], category } = {}) {
  // ensure valid category
  if (!CATEGORY_ENUMS.includes(category)) {
    return null;
  }

  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($filters: [String!]) {
        inspiration {
          categories {
            ${category}(filters: $filters) {
              title
            }
          }
        }
      }`,
    variables: {
      filters,
    },
    slowThreshold: 3000,
  };
}

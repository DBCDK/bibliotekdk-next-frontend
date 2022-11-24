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
  // if (!CATEGORY_ENUMS.includes(category)) {
  //   return null;
  // }

  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($limit: Int!, $filters: [CategoryFilter!]) {
        inspiration {
          categories(filter: $filters) {
            category
            subCategories {
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
 * @param {object} params.filters
 * @param {array} params.categories
 */

export function categories({ filters = [], categories = [] } = {}) {
  // ensure valid category
  // if (categories.filter((c) => CATEGORY_ENUMS.includes(c)).length === 0) {
  //   return null;
  // }

  console.log({ filters });

  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($filters: [CategoryFilter!]) {
        inspiration {
          categories(filter: $filters) {
            category
            subCategories {
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

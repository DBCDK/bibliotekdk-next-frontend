import { ApiEnums } from "@/lib/api/api";

import {
  creatorsFragment,
  materialTypesFragment,
} from "@/lib/api/fragments.utils";

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
 * @param {Object} params
 * @param {string} params.limit
 */

export function inspiration({ filters = [], limit = 10 } = {}) {
  // Remove unknown categories
  filters = filters.filter((f) => CATEGORY_ENUMS.includes(f.category));
  if (filters.length === 0) {
    return null;
  }

  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
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
                    full
                  }
                  creators {
                    ...creatorsFragment
                  }
                }
                manifestation {
                  materialTypes {
                    ...materialTypesFragment
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
      }
      ${creatorsFragment}
      ${materialTypesFragment}`,
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
 * @param {Object} params
 * @param {Object} params.filters
 */

export function categories({ filters = [] } = {}) {
  // Remove unknown categories
  filters = filters.filter((f) => CATEGORY_ENUMS.includes(f.category));
  if (filters.length === 0) {
    return null;
  }

  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
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

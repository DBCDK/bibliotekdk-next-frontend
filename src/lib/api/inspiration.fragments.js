import { ApiEnums } from "@/lib/api/api";

import {
  creatorsFragment,
  materialTypesFragment,
  tvSeriesFragment,
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
  filters = filters
    .filter((f) => CATEGORY_ENUMS.includes(f.category))
    ?.map((f) => ({ ...f, category: f.category.toUpperCase() }));
  if (filters.length === 0) {
    return null;
  }

  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($limit: Int!, $filters: [CategoryFilterInput!]) {
        inspiration {
          categories(filter: $filters) {
            category: title
            subCategories {
              title
              result(limit: $limit) {
                work {
                  traceId
                  workId
                  titles {
                    main
                    full
                    tvSeries {
                    ...tvSeriesFragment
                    }
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
      ${materialTypesFragment}
      ${tvSeriesFragment}`,

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
  filters = filters
    .filter((f) => CATEGORY_ENUMS.includes(f.category))
    ?.map((f) => ({ ...f, category: f.category.toUpperCase() }));
  if (filters.length === 0) {
    return null;
  }

  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($filters: [CategoryFilterInput!]) {
        inspiration {
          categories(filter: $filters) {
            category: title
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

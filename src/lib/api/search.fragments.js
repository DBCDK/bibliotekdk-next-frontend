/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

import { FilterTypeEnum } from "@/lib/enums";
import { ApiEnums } from "@/lib/api/api";

import {
  creatorsFragment,
  materialTypesFragment,
  tvSeriesFragment,
} from "@/lib/api/fragments.utils";

/**
 * Hitcount
 *
 * @param {string} q the query
 * @param {Object} filters filters for searching
 */
export function hitcount({ q, filters = {} }) {
  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
    // delay: 1000, // for debugging
    query: `
    query ($q: SearchQueryInput!, $filters: SearchFiltersInput) {
      search(q: $q, filters: $filters) {
        hitcount
      }
    }`,
    variables: { q, filters },
    slowThreshold: 3000,
  };
}

/**
 * Suggestions for alternative spellings
 * @param q
 * @param limit
 * @returns {{variables: {q, limit: number}, apiUrl: string, slowThreshold: number, query: string}}
 */
export function didYouMean({ q, limit = 5 }) {
  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
    query: `
      query didyoumean ($q: SearchQuery!, $limit: Int!) {
        search(q: $q) {
        didYouMean(limit: $limit) {
          query
          score
        }
      }      
    }`,
    variables: { q, limit },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {string} q the query
 * @param {number} limit number of results
 * @param {number} offset offset for pagination
 * @param {Object} filters filters for searching
 * @param {Boolean} search_exact
 */
export function all({
  q,
  limit = 100,
  offset = 0,
  filters = {},
  search_exact = false,
}) {
  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
    // delay: 1000, // for debugging
    query: `
    query all ($q: SearchQueryInput!, $filters: SearchFiltersInput, $offset: Int!, $limit: PaginationLimitScalar!, $search_exact: Boolean) {
      search(q: $q, filters: $filters, search_exact: $search_exact) {
        works(limit: $limit, offset: $offset) {
          workId
          latestPublicationDate
          series {
            title
            members{
              numberInSeries
              work{
                workId
              }
        }
          }
          mainLanguages {
            isoCode
            display
          }
          workTypes
          manifestations {
            mostRelevant{
              pid
              ownerWork {
                workTypes
              }
              cover {
                detail
                origin
              }
              materialTypes {
                ...materialTypesFragment
              }
              hostPublication {
                title
                issue
              }
              publisher
              edition {
                summary
                edition
              }
            }            
          }
          creators {
            ...creatorsFragment
          }
          materialTypes {
            ...materialTypesFragment
          }
          fictionNonfiction {
            display
          }
          genreAndForm
          titles {
            main
            full
            parallel
            sort
            tvSeries {
            ...tvSeriesFragment
            }
          }
        }
        hitcount
      }
    }
    ${creatorsFragment}
    ${materialTypesFragment}
    ${tvSeriesFragment}`,
    variables: {
      q,
      limit,
      offset,
      filters,
      search_exact,
    },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {string} q the query
 * @param {Object} filters for searching
 * @param {Array} facets for adding filters
 */
export function facets({
  q,
  filters = {},
  facets = Object.values(FilterTypeEnum),
}) {
  if (facets) {
    facets = facets.map((f) => f.toUpperCase());
  }
  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
    // delay: 1000, // for debugging
    query: `
    query ($q: SearchQueryInput!, $filters: SearchFiltersInput, $facets: [FacetFieldEnum!]!) {
      search(q: $q, filters: $filters) {
        facets(facets: $facets) {
          name
          values(limit: 100) {
            term
            key
            score
          }
        }
      }
    }`,
    variables: {
      q,
      filters,
      facets,
    },
    slowThreshold: 3000,
  };
}

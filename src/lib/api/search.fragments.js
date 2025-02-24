/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

import { FilterTypeEnum } from "@/lib/enums";
import { ApiEnums } from "@/lib/api/api";

import {
  cacheWorkFragment,
  creatorsFragment,
  materialTypesFragment,
  tvSeriesFragment,
} from "@/lib/api/fragments.utils";
import { cacheWork } from "./work.fragments";

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
      query didyoumean ($q: SearchQueryInput!, $limit: Int!) {
        search(q: $q) {
        didYouMean(limit: $limit) {
          traceId
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
          traceId
          workId
          series {
            title
            numberInSeries  
          }
          mainLanguages {
            isoCode
            display
          }
          manifestations {
            mostRelevant{
            publisher
              pid
              cover {
                detail: detail_207
                origin
              }
              materialTypes {
                ...materialTypesFragment
              }
            }            
          }
          creators {
            ...creatorsFragment
          }
          titles {
            main
            full
            parallel
            sort
            tvSeries {
            ...tvSeriesFragment
            }
          }
          ... cacheWorkFragment
        }
        hitcount
      }
    }
    ${cacheWorkFragment}
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
    onLoad: ({ data, keyGenerator, cache }) => {
      data?.search?.works?.forEach((work) => {
        cache(
          keyGenerator(cacheWork({ workId: work.workId })),
          { data: { work } },
          false
        );
      });
    },
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

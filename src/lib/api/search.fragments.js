/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

import { FilterTypeEnum } from "@/lib/enums";
import { ApiEnums } from "@/lib/api/api";
import { creatorsFragment } from "@/lib/api/work.fragments";

/**
 * Hitcount
 *
 * @param {string} q the query
 * @param {object} filters filters for searching
 */
export function hitcount({ q, filters = {} }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ($q: SearchQuery!, $filters: SearchFilters) {
      search(q: $q, filters: $filters) {
        hitcount
      }
      monitor(name: "bibdknext_search_hitcount")
    }`,
    variables: { q, filters },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {string} q the query
 * @param {number} limit number of results
 * @param {number} offset offset for pagination
 * @param {object} filters filters for searching
 */
export function all({ q, limit = 100, offset = 0, filters = {} }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ($q: SearchQuery!, $filters: SearchFilters, $offset: Int!, $limit: PaginationLimit!) {
      search(q: $q, filters: $filters) {
        works(limit: $limit, offset: $offset) {
          workId
          mainLanguages {
            isoCode
            display
          }
          workTypes
          manifestations {
            mostRelevant{
              ownerWork {
                workTypes
              }
              cover {
                detail
                origin
              }
              materialTypes {
                specific
              }
            }            
          }
          creators {
            ...creatorsFragment
          }
          materialTypes {
            specific
          }
          fictionNonfiction {
            display
          }
          genreAndForm
          titles {
            main
            full
            parallel
          }
        }
        hitcount
      }
      monitor(name: "bibdknext_search_all")
    }
    ${creatorsFragment}`,
    variables: {
      q,
      limit,
      offset,
      filters,
    },
    slowThreshold: 3000,
  };
}

/**
 * Detailed search response
 *
 * @param {string} q the query
 * @param {object} filters for searching
 * @param {array} facets for adding filters
 */
export function facets({
  q,
  filters = {},
  facets = Object.values(FilterTypeEnum),
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ($q: SearchQuery!, $filters: SearchFilters, $facets: [FacetField!]!) {
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
      monitor(name: "bibdknext_search_facets")
    }`,
    variables: {
      q,
      filters,
      facets,
    },
    slowThreshold: 3000,
  };
}

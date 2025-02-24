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
 * @param {string} cql  the  cql-query
 * @param offset
 * @param limit
 * @param sort
 */
export function doComplexSearchAll({ cql, offset, limit, sort, facets }) {
  if (sort?.order) {
    sort = { ...sort, order: sort.order.toUpperCase() };
  }
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ComplexSearchAll($cql: String!, $offset: Int!, $limit: PaginationLimitScalar!, $sort: [SortInput!], $facets: ComplexSearchFacetsInput) {
			complexSearch(cql: $cql, facets: $facets) {
				hitcount
				errorMessage
        facets {
          name
          values {
            traceId
            key
            score
          }
        }				
				works(limit: $limit, offset: $offset, sort: $sort) {
          ...cacheWorkFragment
          traceId
          workId
          latestPublicationDate
          series {
            title   
            numberInSeries
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
                detail: detail_207
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
			}
		},
    ${cacheWorkFragment}
    ${creatorsFragment}
    ${materialTypesFragment}
    ${tvSeriesFragment}`,
    variables: { cql, offset, limit, sort, facets },
    slowThreshold: 3000,
    onLoad: ({ data, keyGenerator, cache }) => {
      data?.complexSearch?.works?.forEach((work) => {
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
 * Hitcount
 *
 * @param {string} cql  the  cql-query
 * @param offset
 * @param limit
 * @param sort
 */
export function complexSearchOnlyWorkIds({ cql, offset, limit, sort }) {
  if (sort?.order) {
    sort = { ...sort, order: sort.order.toUpperCase() };
  }
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ComplexSearchOnlyWorkIds($cql: String!, $offset: Int!, $limit: PaginationLimitScalar!, $sort: [SortInput!]) {
			complexSearch(cql: $cql) {
				hitcount
				errorMessage
				works(offset: $offset, limit: $limit, sort: $sort) {
				  traceId
					workId
        }
			}
		}`,
    variables: { cql, offset, limit, sort },
    slowThreshold: 3000,
  };
}

export function ComplexArticleSlider({ cql, offset, limit, sort }) {
  if (sort?.order) {
    sort = { ...sort, order: sort.order.toUpperCase() };
  }
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query ComplexArticleSlider($cql: String!, $offset: Int!, $limit: PaginationLimitScalar!, $sort: [SortInput!]) {
			complexSearch(cql: $cql) {
				hitcount
				errorMessage        
				works(offset: $offset, limit: $limit, sort: $sort) {
          workId
          ...cacheWorkFragment
          titles {
            main
            full
          }
          creators {
            ...creatorsFragment
          }
          
          manifestations {mostRelevant {
            materialTypes {
              ...materialTypesFragment
            }
            cover {
              detail: detail_207
              origin
            }
          }}
        }
      }
    }
    ${cacheWorkFragment}
    ${creatorsFragment}
    ${materialTypesFragment}
    `,
    variables: { cql, offset, limit, sort },
    slowThreshold: 3000,
    onLoad: ({ data, keyGenerator, cache }) => {
      data?.complexSearch?.works?.forEach((work) => {
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
 * Hitcount
 *
 * @param {string} cql  the  cql-query
 * @param offset
 * @param limit
 * @param sort
 */
export function hitcount({ cql, offset, limit, sort, facets }) {
  if (sort?.order) {
    sort = { ...sort, order: sort.order.toUpperCase() };
  }
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query hitcount($cql: String!, $facets: ComplexSearchFacetsInput) {
			complexSearch(cql: $cql, facets: $facets) {
				hitcount
				errorMessage
				facets {
          name
          values {
            key
            score
          }
        }			
			}
		}`,
    variables: { cql, offset, limit, sort, facets },
    slowThreshold: 3000,
  };
}

export function complexFacetsOnly({ cql, facets }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query facetsOnly($cql: String!, $facets: ComplexSearchFacetsInput) {
			complexFacets(cql: $cql, facets: $facets) {
			  hitcount
				facets {
          name
          values {
            traceId
            key
            score
          }
        }			
			}
		}`,
    variables: { cql, facets },
    slowThreshold: 3000,
  };
}

export function complexSearchIndexes() {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query ComplexSearchIndexes {
			complexSearchIndexes {
				index	
			}
		}`,
    variables: {},
    slowThreshold: 3000,
  };
}

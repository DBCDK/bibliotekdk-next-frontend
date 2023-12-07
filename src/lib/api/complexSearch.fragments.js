import { ApiEnums } from "@/lib/api/api";

/**
 * Hitcount
 *
 * @param {string} cql  the  cql-query
 * @param offset
 * @param limit
 * @param sort
 */
export function doComplexSearchAll({ cql, offset, limit, sort }) {
  return {
    apiUrl: ApiEnums.FBI_API_BIBDK21,
    // delay: 1000, // for debugging
    query: `
    query ComplexSearchAll($cql: String!, $offset: Int!, $limit: PaginationLimit!, $sort: [Sort!]) {
			complexSearch(cql: $cql) {
				hitcount
				errorMessage
				works(offset: $offset, limit: $limit, sort: $sort) {
					workId
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
                materialTypeGeneral {
                  code
                  display
                }
                materialTypeSpecific {
                  code
                  display
                }
              }
              hostPublication {
                title
              }
              publisher
              edition {
                summary
                edition
              }
            }            
          }
          creators {
            ... on Corporation {
              __typename
              display
              nameSort
              roles {
                function {
                  plural
                  singular
                }
                functionCode
              }
            }
            ... on Person {
              __typename
              display
              nameSort
              roles {
                function {
                  plural
                  singular
                }
                functionCode
              }
            }
          }
          materialTypes {
            materialTypeGeneral {
              code
              display
            }
            materialTypeSpecific {
              code
              display
            }
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
          }
        }
			}
		}`,
    variables: { cql, offset, limit, sort },
    slowThreshold: 3000,
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
  return {
    apiUrl: ApiEnums.FBI_API_BIBDK21,
    // delay: 1000, // for debugging
    query: `
    query ComplexSearchOnlyWorkIds($cql: String!, $offset: Int!, $limit: PaginationLimit!, $sort: [Sort!]) {
			complexSearch(cql: $cql) {
				hitcount
				errorMessage
				works(offset: $offset, limit: $limit, sort: $sort) {
					workId
        }
			}
		}`,
    variables: { cql, offset, limit, sort },
    slowThreshold: 3000,
  };
}

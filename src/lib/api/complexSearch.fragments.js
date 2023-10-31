/**
 * Hitcount
 *
 * @param {string} cql  the  cql-query

 */
export function doComplexSearchAll({ cql, offset, limit }) {
  return {
    // delay: 1000, // for debugging
    query: `
    query ComplexSearchAll($cql: String!, $offset: Int!, $limit: PaginationLimit!) {
			complexSearch(cql: $cql) {
				hitcount
				errorMessage
				works(offset: $offset, limit: $limit) {
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
    variables: { cql, offset, limit },
    slowThreshold: 3000,
  };
}

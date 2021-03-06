/**
 * @file Contains GraphQL queries all taking a workId as variable
 *
 */

/**
 * Basic work info that is fast to fetch
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function basic({ workId }) {
  return {
    // delay: 250,
    query: `query ($workId: String!) {
        work(id: $workId) {
          creators {
            type
            name
          }
          description
          materialTypes {
            materialType
            manifestations {
              pid
              materialType
            }
          }
          path
          title
          subjects{
            type
            value
          }
        }
        monitor(name: "bibdknext_work_basic")
      }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Covers for the different material types
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function covers({ workId }) {
  return {
    // delay: 250,
    query: `query ($workId: String!) {
      work(id: $workId) {
        materialTypes {
          cover {
            detail
          }
        }
      }
      monitor(name: "bibdknext_work_covers")
    }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Details for work manifestations
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function details({ workId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
        work(id: $workId) {
          cover {
            detail
          }
          seo {
            title
            description
          }
          materialTypes {
            materialType
            manifestations {
              admin{
                requestButton
              }
              content
              creators {
                type
                functionSingular
                name
              }
              datePublished
              edition
              isbn
              materialType
              language
              onlineAccess {
                url
                note
              }
              physicalDescription
              publisher
            }
          }
        }
        monitor(name: "bibdknext_work_details")
      }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Details for all manifestations in a work
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function detailsAllManifestations({ workId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
        work(id: $workId) {
          cover {
            detail
          }
          path
          seo {
            title
            description
          }
          manifestations {
            inLanguage
            content
            creators {
              type
              functionSingular
              name
            }
            cover {
              detail
            }
            datePublished
            dk5 {
              value
            }
            edition
            hostPublication {
              title
              details
            }
            isbn
            materialType
            notes
            language
            originals
            originalTitle
            pid
            physicalDescription
            publisher
            shelf
            title
          }
        }
        monitor(name: "bibdknext_work_detailsallmanifestations")
      }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Recommendations for a work
 *
 * This is still the old laesekompas recommender
 * Will be changed at some point
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function recommendations({ workId }) {
  return {
    // delay: 4000, // for debugging
    query: `query ($workId: String!) {
    manifestation(pid: $workId) {
      recommendations {
        reader
        manifestation {
          cover {
            detail
          }
          pid
          title
          creators {
            name
          }
        }
      }
    }
    monitor(name: "bibdknext_work_recommendations")
  }
  `,
    variables: { workId: workId.replace("work-of:", "") },
    slowThreshold: 3000,
  };
}

/**
 * Recommendations for a work
 *
 * This is still the old laesekompas recommender
 * Will be changed at some point
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function reviews({ workId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
        work(id: $workId) {
          reviews {
            __typename
            ... on ReviewInfomedia {
              author
              date
              media
              rating
            }
            ... on ReviewLitteratursiden {
              author
              date
              url
            }
            ... on ReviewMatVurd {
              author
              date
              all {
                text
                work {
                  title
                  id
                  creators {
                    name
                  }
                }
              }
            }
          }
        }
        monitor(name: "bibdknext_work_reviews")
      }`,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Series for a work
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function series({ workId }) {
  return {
    // delay: 4000, // for debugging
    query: `query ($workId: String!) {
      work(id: $workId) {
        series {
          title
          works {
            id
            title
            creators {
              name
            }
            cover {
              detail
            }
            series {
              part
            }
          }
        }
      }
      monitor(name: "bibdknext_work_series")
    }
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

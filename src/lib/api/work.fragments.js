/**
 * @file Contains GraphQL queries all taking a workId as variable
 *
 */

/**
 * Basic work info that is fast to fetch
 *
 * If its too slow, then consider moving "cover"
 * to its own fragment
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function basic({ workId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
        work(id: $workId) {
          creators {
            type
            name
          }
          description
          materialTypes {
            cover {
              detail
            }
            pid
            materialType
          }
          path
          title
        }
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
        manifestation {
          abstract
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
  }
  `,
    variables: { workId: workId.replace("work-of:", "") },
    slowThreshold: 3000,
  };
}

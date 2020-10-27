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
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
        work(id: $workId) {
          creators {
            type
            name
          }
          description
          materialTypes {
            pid
            materialType
          }
          path
          title
          subjects{
            type
            value
          }
        }
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
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
      work(id: $workId) {
        materialTypes {
          cover {
            detail
          }
        }
      }
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
          materialTypes {
            content
            creators {
              type
              functionSingular
              name
            }
            datePublished
            materialType
            language
            physicalDescription
          }
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

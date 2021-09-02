/**
 * @file Contains GraphQL queries
 *
 */

/**
 * Infomedia
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
export function infomediaArticle({ workId }) {
  return {
    // delay: 4000, // for debugging
    query: `query ($workId: String!) {
      work(id: $workId) {
        workTypes
        manifestations {
          title
          creators {
            name
          }
          onlineAccess {
            __typename
            ...on InfomediaContent {
              id
              dateLine
              origin
              logo
              paper
              text
              headLine
              subHeadLine
              hedLine
            }
          }
        }
        subjects {
          type
          value
        }
      }
      monitor(name: "bibdknext_work_infomedia")
    }
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

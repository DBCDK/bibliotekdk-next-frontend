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
export function infomediaArticle({ pid }) {
  console.log(pid, "PID");
  return {
    // delay: 4000, // for debugging
    query: `query ($pid: String!) {
      infomediaContent(pid: $pid) {
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
       
      monitor(name: "bibdknext_work_infomedia")
    }
  `,
    variables: { pid },
    slowThreshold: 3000,
  };
}

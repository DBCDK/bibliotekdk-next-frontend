/**
 * @file Contains GraphQL queries all taking a pid (manifestion) as variable
 *
 */

/**
 * availability
 */
export function availability({ pid }) {
  return {
    // delay: 250,
    query: `query ($pid: String!) {
      manifestation(pid: $pid) {
      materialType
      materialType
           
              availability{
                orderPossible
                orderPossibleReason
                willLend
                expectedDelivery
              }
           
      }
      monitor(name: "bibdknext_manifestations_availability")
    }`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

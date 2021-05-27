/**
 * @file Contains GraphQL queries all taking a pid (manifestion) as variable
 *
 */

/**
 * availability
 */
export function availability({ pid, agencyId }) {
  return {
    // delay: 250,
    query: `query ($pid: String!) {
      manifestation(pid: $pid) {
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
    variables: { pid, agencyId },
    slowThreshold: 3000,
  };
}

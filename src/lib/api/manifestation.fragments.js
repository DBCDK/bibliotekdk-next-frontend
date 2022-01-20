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

export function refWorks(pid) {
  return {
    // delay: 250,
    query: `query ($pid: String!) {
      refWorks(pid:$pid)
      monitor(name: "bibdknext_manifestation_refworks")
    }`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function ris({ pid }) {
  return {
    // delay: 250,
    query: `query ($pid: String!) {
      ris(pid:$pid)
      monitor(name: "bibdknext_manifestation_ris")
    }`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

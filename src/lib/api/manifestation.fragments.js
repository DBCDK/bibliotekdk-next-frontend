/**
 * @file Contains GraphQL queries all taking a pid (manifestion) as variable
 *
 */
import { ApiEnums } from "@/lib/api/api";

export function refWorks(pid) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 250,
    query: `
    query ($pid: String!) {
      refWorks(pid:$pid)
      monitor(name: "bibdknext_manifestation_refworks")
    }`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

export function ris(pid) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 250,
    query: `query ($pid: String!) {
      ris(pid:$pid)
      monitor(name: "bibdknext_manifestation_ris")
    }`,
    variables: { pid },
    slowThreshold: 3000,
  };
}

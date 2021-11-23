import { lang } from "@/components/base/translate";

/**
 * @file Contains GraphQL queries for fetching branches
 *
 */

/**
 * Get a single branch to determine which parameters a user is required
 * to submit when ordering stuff
 */
export function branchUserParameters({ branchId }) {
  return {
    // delay: 1000, // for debugging
    query: `query BranchUserParameters($branchId: String!, $language: LanguageCode!) {
      branches(branchId: $branchId, language: $language) {
        result {
          borrowerCheck
          name
          branchId
          agencyName
          agencyId
          city
          postalAddress
          postalCode
          userParameters {
            userParameterType
            parameterRequired
            description
          }
          pickupAllowed
          digitalCopyAccess
        }
      }
      monitor(name: "bibdknext_branch_user_parameters")
     }`,
    variables: { branchId, language: lang },
    slowThreshold: 3000,
  };
}

/**
 * Get orderPolicy for a branch
 */
export function branchOrderPolicy({ branchId, pid }) {
  return {
    // delay: 1000, // for debugging
    query: `query BranchUserParameters($branchId: String!, $language: LanguageCode!, $pid: String!) {
      branches(branchId: $branchId, language: $language) {
        result {
          orderPolicy(pid: $pid) {
            orderPossible
            orderPossibleReason
            lookUpUrl
          }
        }
      }
      monitor(name: "bibdknext_branch_orderPolicy")
     }`,
    variables: { branchId, language: lang, pid },
    slowThreshold: 3000,
  };
}

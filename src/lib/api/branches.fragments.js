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
          agencyName
          agencyId
          userParameters {
            userParameterType
            parameterRequired
          }
          pickupAllowed
        }
      }
      monitor(name: "bibdknext_branch_user_parameters")
     }`,
    variables: { branchId, language: lang },
    slowThreshold: 3000,
  };
}

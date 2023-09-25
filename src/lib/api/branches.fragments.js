import { lang } from "@/components/base/translate";
import { ApiEnums } from "@/lib/api/api";

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
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query BranchUserParameters($branchId: String!, $language: LanguageCode!) {
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
 * Get Holdings for a branch.
 * @param branchId
 * @param pids
 * @return {{variables: {branchId, pids}, slowThreshold: number, query: string}}
 */
export function branchHoldings({ branchId, pids }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query BranchHoldings($branchId: String!, $pids: [String]){
      branches(branchId:$branchId){
        agencyUrl
        result {
          agencyName
          name
          agencyId
          branchId
          branchWebsiteUrl
          branchCatalogueUrl
          lookupUrl
          holdingStatus(pids:$pids) {
            count
            lamp{color message}
            agencyHoldings {
              localisationPid
              localIdentifier
              agencyId                    
            }
            holdingItems {
              branch
              branchId
              willLend 
              expectedDelivery 
              localHoldingsId 
              circulationRule
              issueId
              department
              issueText
              location
              note
              readyForLoan
              status
              subLocation
            }
          }
        }
      }
      monitor(name: "bibdknext_branch_holdings")
    }`,
    variables: { branchId, pids },
    slowThreshold: 3000,
  };
}

/**
 * Get orderPolicy for a branch
 */
export function branchOrderPolicy({ branchId, pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query BranchesOrderPolicy($branchId: String!, $language: LanguageCode!, $pid: String!) {
      branches(branchId: $branchId, language: $language) {
        result {
          orderPolicy(pid: $pid) {
            orderPossible
            orderPossibleReason
            lookUpUrl
          }
          digitalCopyAccess
        }
      }
      monitor(name: "bibdknext_branch_orderPolicy")
     }`,
    variables: { branchId, language: lang, pid },
    slowThreshold: 3000,
  };
}

/**
 * AgencyUrl and canBorrow for a branch
 */
export function checkBlockedUser({ branchId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query checkBlockedUser($branchId: String!, $language: LanguageCode!) {
      branches(branchId: $branchId, language: $language) {
        agencyUrl
        canBorrow {
          canBorrow
          statusCode
        }
        result {
          agencyName
        	branchWebsiteUrl
        }
      }
      monitor(name: "bibdknext_CheckBlockedUser")
    }`,
    variables: { branchId, language: lang },
    slowThreshold: 3000,
  };
}

/**
 * Get a single branch to determine which parameters a user is required
 * to submit when ordering stuff
 */
export function branchDigitalCopyAccess({ branchId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query branchDigitalCopyAccess($branchId: String!, $language: LanguageCode!) {
      branches(branchId: $branchId, language: $language) {
        result {
          digitalCopyAccess
        }
      }
      monitor(name: "bibdknext_branch_digital_copy_access")
     }`,
    variables: { branchId, language: lang },
    slowThreshold: 3000,
  };
}

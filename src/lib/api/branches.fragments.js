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
    query BranchUserParameters($branchId: String!, $language: LanguageCodeEnum!) {
      branches(branchId: $branchId, language: $language) {
        agencyUrl
        borrowerStatus {
          allowed
          statusCode
        }      
        result {
          borrowerCheck
          culrDataSync
          name
          branchId
          agencyName
          agencyId
          agencyType
          city
          postalAddress
          postalCode
          userParameters {
            userParameterType
            userParameterName
            parameterRequired
            description
          }
          pickupAllowed
          temporarilyClosed
          temporarilyClosedReason          
          digitalCopyAccess
          branchWebsiteUrl
          mobileLibraryLocations
        }
      }
      monitor(name: "bibdknext_branch_user_parameters")
     }`,
    variables: { branchId, language: lang?.toUpperCase() },
    slowThreshold: 3000,
  };
}

/**
 * Get Holdings for a branch.
 * @param branchId
 * @param pids
 * @returns {{variables: {branchId, pids}, slowThreshold: number, query: string}}
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
          pickupAllowed
          holdingStatus(pids:$pids) {
            count
            expectedDelivery
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
export function branchOrderPolicy({ branchId, pids }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query BranchesOrderPolicy($branchId: String!, $language: LanguageCodeEnum!, $pids: [String!]!) {
      branches(branchId: $branchId, language: $language) {
        result {
          orderPolicy(pids: $pids) {
            orderPossible
            orderPossibleReason
            lookUpUrl
            lookUpUrls
          }
          digitalCopyAccess
        }
      }
      monitor(name: "bibdknext_branch_orderPolicy")
     }`,
    variables: { branchId, language: lang?.toUpperCase(), pids },
    slowThreshold: 3000,
  };
}

/**
 * Get orderPolicy for a branch
 */
export function isFFUAgency({ branchId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query isFFUAgency($branchId: String!) {
      branches(branchId: $branchId, agencyTypes: [FORSKNINGSBIBLIOTEK]) {
        hitcount
        result {
          borrowerCheck
          culrDataSync
        }
      }
    }`,
    variables: { branchId },
    slowThreshold: 3000,
  };
}

export function checkBlockedUser({ branchId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query checkBlockedUser($branchId: String!, $language: LanguageCodeEnum!) {
      branches(branchId: $branchId, language: $language) {
        agencyUrl
        borrowerStatus {
          allowed
          statusCode
        }
        result {
          borrowerCheck
          agencyName
        	branchWebsiteUrl
        }
      }
      monitor(name: "bibdknext_CheckBlockedUser")
    }`,
    variables: { branchId, language: lang?.toUpperCase() },
    slowThreshold: 3000,
  };
}

export function branchesHighlightsByAgency({ agencyId, q, limit = 50 }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query branchesHighlightsByAgency($agencyId: String!, $q: String, $limit: PaginationLimitScalar!, $language: LanguageCodeEnum!) {
      branches(agencyid: $agencyId, q: $q, bibdkExcludeBranches: true, limit: $limit, statuses: AKTIVE, language: $language) {
        hitcount
        agencyUrl
        result {
          ...branchFastFragment
        }
      }
    }
    ${branchFastFragment}`,
    variables: { agencyId, q, limit, language: lang?.toUpperCase() },
    slowThreshold: 3000,
  };
}

/**
 * Branches in agencies
 */
export function branchByBranchId({ branchId, pids, limit = 50, q = "" }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query branchByBranchId($branchId: String!, $q: String, $pids: [String!]!, $limit: PaginationLimitScalar!, $language: LanguageCodeEnum!) {
      branches(branchId: $branchId, q: $q, bibdkExcludeBranches: true, limit: $limit, statuses: AKTIVE, language: $language) {
        hitcount
        agencyUrl
        result {
          ...branchFastFragment
          holdingStatus(pids: $pids) {
            ...holdingStatusFragment
          }
        }
      }
    }
    ${branchFastFragment}
    ${holdingStatusFragment}`,
    variables: { branchId, q, pids, limit, language: lang?.toUpperCase() },
    slowThreshold: 3000,
  };
}

/**
 * Branches in agencies
 */
export function branchesByQuery({ q, limit = 50 }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query branchesActiveInAgency($q: String!, $limit: PaginationLimitScalar!, $language: LanguageCodeEnum!) {
      branches(q: $q, bibdkExcludeBranches: true,  limit: $limit, statuses: AKTIVE, language: $language) {
        hitcount
        agencyUrl
        result {
          ...branchFastFragment
        }
      }
    }
    ${branchFastFragment}`,
    variables: { q, limit, language: lang?.toUpperCase() },
    slowThreshold: 3000,
  };
}

/**
 * Branches in agencies
 */
export function checkOrderPolicy({ pids, branchId, limit = 10 }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query checkOrderPolicy($branchId: String!, $pids: [String!]!, $limit: PaginationLimitScalar!, $language: LanguageCodeEnum!) {
      branches(branchId: $branchId, limit: $limit, bibdkExcludeBranches: true, statuses: AKTIVE, language: $language) {
        result {
          branchId
          orderPolicy(pids: $pids) {
            ...orderPolicyFragment
          }
        }
      }
    }
    ${orderPolicyFragment}`,
    variables: { branchId, pids, limit, language: lang?.toUpperCase() },
    slowThreshold: 3000,
  };
}

/**
 * Branches in agencies
 */
export function borrowerCheck({ branchId }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query borrowerCheck($branchId: String!, $language: LanguageCodeEnum!) {
      branches(branchId: $branchId, bibdkExcludeBranches: true, statuses: AKTIVE, language: $language) {
        result {
          branchId
          ...borrowerCheckFragment
        }
      }
    }
    ${borrowerCheckFragment}`,
    variables: { branchId, language: lang?.toUpperCase() },
    slowThreshold: 3000,
  };
}

export function holdingsForAgency({ agencyId, pids }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    query holdingsForAgency($agencyId: String!, $pids: [String!]!, $limit: PaginationLimitScalar!) {
      branches(agencyid: $agencyId, limit: $limit, statuses: AKTIVE) {
        result {
          agencyName
          name
          agencyId
          branchId
          branchType
          pickupAllowed
          holdings(pids: $pids) {
            status
            expectedAgencyReturnDate
            expectedBranchReturnDate
            ownedByAgency
            items {
              department
              location
              subLocation
              loanRestriction
            }
            unlistedBranchItems {
              branchName
              status
            }
            lookupUrl
          }
          branchPhone
          branchEmail
          temporarilyClosed
          temporarilyClosedReason
          openingHours
          openingHoursUrl
          postalAddress
          postalCode
          city
        }
      }
    }`,
    variables: { agencyId, pids, limit: 50 },
    slowThreshold: 3000,
  };
}

const borrowerCheckFragment = `fragment borrowerCheckFragment on Branch {
  borrowerCheck
}`;

const branchFastFragment = `fragment branchFastFragment on Branch {
  agencyId
  agencyName
  branchId
  branchType
  name
  openingHours
  postalAddress
  postalCode
  city
  pickupAllowed
  highlights {
    key
    value
  }
  branchWebsiteUrl
  branchCatalogueUrl
  lookupUrl
  temporarilyClosed
  temporarilyClosedReason
}`;

const orderPolicyFragment = `fragment orderPolicyFragment on CheckOrderPolicy {
  lookUpUrls
  lookUpUrl
  orderPossible
  orderPossibleReason
}`;

const holdingStatusFragment = `fragment holdingStatusFragment on DetailedHoldings {
    count
    branchId
    expectedDelivery
    agencyHoldings {
      agencyId
      localisationPid
      localIdentifier
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
    lamp {
      color
      message
    }
}`;

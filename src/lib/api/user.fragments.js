import { lang } from "@/components/base/translate";
import { ApiEnums } from "@/lib/api/api";

import {
  creatorsFragment,
  manifestationTitleFragment,
  materialTypesFragment,
} from "@/lib/api/fragments.utils";

/**
 * @file Contains GraphQL queries all taking a workId as variable
 *
 */

/**
 * Basic user info
 *
 */
export function basic() {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query BasicUser {
      user {
        name
        mail
        address
        postalCode
        isCPRValidated
        loggedInAgencyId
        municipalityAgencyId
        omittedCulrData {
          hasOmittedCulrUniqueId
          hasOmittedCulrMunicipality
          hasOmittedCulrMunicipalityAgencyId
          hasOmittedCulrAccounts
        }
        rights {
          infomedia 
          digitalArticleService 
          demandDrivenAcquisition
        }
        agencies {
          id
          name
          type
          hitcount
          user {
            mail
          }
          result {
            branchId
            agencyId
            agencyName
            agencyType
            name
            branchWebsiteUrl
            pickupAllowed
            borrowerCheck
            culrDataSync
          }
        }
        debt {
            title
            amount
            creator
            date
            currency
            agencyId
        }
        loans {
          agencyId
          loanId
          dueDate
          title
          creator
          manifestation {
            pid
            ...manifestationTitleFragment
            ownerWork {
              workId
            }
            creators {
              ...creatorsFragment
            }
            materialTypes {
              ...materialTypesFragment
            }
            cover {
              thumbnail
            }
            recordCreationDate
          }
        }
        orders {
          orderId
          status
          pickUpBranch {
            agencyName
            agencyId
          }
          pickUpExpiryDate
          holdQueuePosition
          creator
          orderType
          orderDate
          title
          manifestation {
            pid
            ...manifestationTitleFragment
            ownerWork {
              workId
            }
            creators {
              ...creatorsFragment
            }
            materialTypes {
              ...materialTypesFragment
            }
            cover {
              thumbnail
            }
            recordCreationDate
          }
        }   
      }
    }
    ${creatorsFragment}
    ${manifestationTitleFragment}
    ${materialTypesFragment}`,
    variables: {},
    slowThreshold: 3000,
    revalidate: true,
  };
}

/**
 * get branches for logged in user
 *
 */
export function branchesForUser() {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query  {
      user {
        municipalityAgencyId
        agencies{
          result
          {
            agencyName
            agencyId
            name
          }
        }
      }
      monitor(name: "bibdknext_user_branches")
     }`,
    variables: { language: lang?.toUpperCase() },
    slowThreshold: 3000,
    revalidate: true,
  };
}

export function orderPolicy({ pids }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query orderPolicy ($language: LanguageCodeEnum!, $pids: [String!]! ) {
      user {
        agencies (language: $language){
          agencyUrl
          result {
            agencyName
            agencyId
            name
            city
            postalAddress
            postalCode
            branchId
            openingHours
            borrowerCheck
            orderPolicy(pids: $pids) {
              orderPossible
              orderPossibleReason
              lookUpUrl
              lookUpUrls
            }
            userParameters {
              userParameterType
              parameterRequired
            }
            pickupAllowed
            userStatusUrl
            digitalCopyAccess
          }
        }
      }
      monitor(name: "bibdknext_orderpolicy")
     }`,
    variables: { language: lang?.toUpperCase(), pids },
    slowThreshold: 3000,
    revalidate: true,
  };
}

export function borrowerStatus() {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query  {
      user {
        agencies {
         borrowerStatus {
          allowed
          statusCode
          }
        }
       }
     }`,
    slowThreshold: 3000,
    revalidate: true,
  };
}

/**
 * get extended user data
 *
 */
export function extendedData() {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query  {
      user {
        persistUserData
        createdAt
        lastUsedPickUpBranch
      }
     }`,
    slowThreshold: 3000,
    revalidate: true,
  };
}

/**
 * saved advanced search history
 */
export function savedSearchesQuery({ offset, limit }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query savedSearches($offset: Int!, $limit: PaginationLimitScalar! ) { 
        user {
          savedSearches(offset: $offset, limit: $limit, ) {
            result {
              id
              searchObject
              createdAt
            }
            hitcount
          }
        }
      
    }`,
    variables: { offset, limit },
    slowThreshold: 3000,
    revalidate: true,
  };
}

/**
 * get saved search info from a cql.
 */
export function getSavedSearchByCql({ cql }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query savedSearchByCql($cql: String! ) { 
        user {
          savedSearchByCql(cql: $cql) {
            id
            searchObject
            createdAt
          }
        }
      
    }`,
    variables: { cql },
    slowThreshold: 3000,
    revalidate: true,
  };
}

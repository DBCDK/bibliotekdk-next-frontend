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
          hitcount
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
    variables: { language: lang },
    slowThreshold: 3000,
  };
}

export function orderPolicy({ pids }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query orderPolicy ($language: LanguageCode!, $pids: [String!]! ) {
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
    variables: { language: lang, pids },
    slowThreshold: 3000,
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
  };
}

/**
 * get last used pickup branch
 *
 */
export function lastUsedPickUpBranch() {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query  {
      user {
        lastUsedPickUpBranch {
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
            parameterRequired
            description
          }
          pickupAllowed
          digitalCopyAccess
        }
      }
     }`,
    slowThreshold: 3000,
  };
}

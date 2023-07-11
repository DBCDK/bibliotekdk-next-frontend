import { lang } from "@/components/base/translate";
import { ApiEnums } from "@/lib/api/api";

import { creatorsFragment } from "@/lib/api/fragments.utils";

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
        agency {
          result {
            branchId
            agencyId
            agencyName
            name
          }
        }
        debt {
            title
            amount
            creator
            date
            currency
        }
        loans {
          loanId
          dueDate
          manifestation {
            pid
            titles {
              main
            }
            ownerWork {
              workId
            }
            creators {
              ...creatorsFragment
            }
            materialTypes {
              specific
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
          }
          pickUpExpiryDate
          holdQueuePosition
          creator
          orderType
          orderDate
          title
          manifestation {
            pid
            titles {
              main
            }
            ownerWork {
              workId
            }
            creators {
              ...creatorsFragment
            }
            materialTypes {
              specific
            }
            cover {
              thumbnail
            }
            recordCreationDate
          }
        }   
      }
    }
    ${creatorsFragment}`,
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
    query ($language: LanguageCode! ) {
      user {
        name
        agency (language: $language){
          result {
            agencyId
            agencyName
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

export function orderPolicy({ pid }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query orderPolicy ($language: LanguageCode!, $pid: String! ) {
      user {
        agency (language: $language){
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
            orderPolicy(pid: $pid) {
              orderPossible
              orderPossibleReason
              lookUpUrl
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
    variables: { language: lang, pid },
    slowThreshold: 3000,
  };
}

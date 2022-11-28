import { lang } from "@/components/base/translate";
import { ApiEnums } from "@/lib/api/api";

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
    query {
      user {
        name
        mail
        address
        postalCode
      }
      monitor(name: "bibdknext_user")
     }`,
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
        agency (language: $language){
          result {
            agencyId
            agencyName
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

import { lang } from "@/components/base/translate";

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
    // delay: 1000, // for debugging
    query: `query {
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

export function orderPolicy({ pid }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($language: LanguageCode!, $pid: String! ) {
      user {
        agency (language: $language){
          agencyName
            agencyId
            name
            city
            postalAddress
            postalCode
            branchId
            openingHours
            orderPolicy(pid: $pid) {
              orderPossible
              orderPossibleReason
              lookUpUrl
            }
            pickupAllowed
          
        }
      }
      monitor(name: "bibdknext_orderpolicy")
     }`,
    variables: { language: lang, pid },
    slowThreshold: 3000,
  };
}

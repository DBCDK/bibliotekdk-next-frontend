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
    query: `query ($language: LanguageCode! ) {
                user {
                    name
                    mail
                    address
                    postalCode
                    agency (language: $language){
                        branches{
                            agencyId
                            name
                            branchId
                            openingHours
                        }
                    }
                }
            }`,
    variables: { language: lang },
    slowThreshold: 3000,
  };
}

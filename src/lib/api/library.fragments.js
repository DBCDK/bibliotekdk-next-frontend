/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

import { ApiEnums } from "@/lib/api/api";

/**
 * Fast search
 *
 * @param {Object} params
 */
export function search({ q, language = "da", agencyId, limit = 10, offset }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    delay: 200, // for debugging
    query: `
    query LibraryFragmentsSearch($q: String, $limit: PaginationLimit, $offset: Int, $language: LanguageCode, $agencyId: String) {
      branches(q: $q, agencyid: $agencyId, language: $language, limit: $limit, offset: $offset, bibdkExcludeBranches:true, status:AKTIVE) {
        hitcount
        agencyUrl
        result {
          borrowerCheck
          agencyName
          branchId
          agencyId
          name
          city
          postalAddress
          postalCode
          pickupAllowed
          branchWebsiteUrl
          branchCatalogueUrl
          highlights {
            key
            value
          }
        }
      }
      monitor(name: "bibdknext_library_search")
    }`,
    variables: { q, agencyId, language, limit, offset },
    slowThreshold: 3000,
  };
}

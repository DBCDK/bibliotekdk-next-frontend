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
export function search({
  q,
  language = "da",
  agencyId,
  agencyTypes,
  limit = 10,
  offset,
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    delay: 200, // for debugging
    query: `
    query LibraryFragmentsSearch($q: String, $limit: PaginationLimitScalar, $offset: Int, $language: LanguageCodeEnum, $agencyId: String, $agencyTypes: [AgencyTypeEnum!]) {
      branches(q: $q, agencyid: $agencyId, language: $language, limit: $limit, offset: $offset, bibdkExcludeBranches:true, statuses:AKTIVE, agencyTypes: $agencyTypes, sortPickupAllowed: true) {
        hitcount
        agencyUrl
        result {
          borrowerCheck
          culrDataSync
          agencyName
          agencyType
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
    variables: {
      q,
      agencyId,
      agencyTypes,
      language: language?.toUpperCase(),
      limit,
      offset,
    },
    slowThreshold: 3000,
  };
}

/**
 * @file Contains GraphQL queries all taking 'q' as variable
 *
 */

/**
 * Hitcount
 *
 * @param {object} params
 * @param {string} params.q the query
 */
export function hitcount({ q, language, agencyId, limit, offset }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($q: String!, $limit: PaginationLimit!, $offset: Int!, $language: String!, $agencyId: String!) {
        branches(q: $q, limit: $limit, offset: $offset, language: $language, agencyId: $agencyId) {
            hitcount
          }
          monitor(name: "bibdknext_library_hitcount")
        }`,
    variables: { q, limit, offset, language, agencyId },
    slowThreshold: 3000,
  };
}

/**
 * Fast search
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function search({ q, language = "da", agencyId, limit = 10, offset }) {
  return {
    delay: 200, // for debugging
    query: `query ($q: String, $limit: PaginationLimit, $offset: Int, $language: LanguageCode, $agencyId: String) {
        branches(q: $q, agencyid: $agencyId, language: $language, limit: $limit, offset: $offset) {
            hitcount
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

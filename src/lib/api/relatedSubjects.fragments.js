import { ApiEnums } from "@/lib/api/api";

/**
 * Related Subjects
 *
 * @param {Object} params
 * @param {Array} params.q
 * @param {string} params.limit
 */
export function subjects({ q, limit = 10 }) {
  return {
    apiUrl: ApiEnums.FBI_API_SIMPLESEARCH,
    // delay: 1000, // for debugging
    query: `query RelatedSubjects($q: [String!]!, $limit: Int) {
        recommendations {
          subjects(q: $q, limit: $limit) {
            subject
            traceId
          }
        }
      }`,
    variables: {
      q,
      limit,
    },
    slowThreshold: 3000,
  };
}

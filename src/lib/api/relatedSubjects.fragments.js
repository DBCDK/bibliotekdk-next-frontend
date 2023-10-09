import { ApiEnums } from "@/lib/api/api";

/**
 * Related Subjects
 *
 * @param {Object} params
 * @param {array} params.q
 * @param {string} params.limit
 */
export function subjects({ q, limit = 10 }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query ($q: [String!]!, $limit: Int) {
        relatedSubjects(q: $q, limit: $limit)
        monitor(name: "bibdknext_related_subjects")
      }`,
    variables: {
      q,
      limit,
    },
    slowThreshold: 3000,
  };
}

import { ApiEnums } from "@/lib/api/api";

/**
 * Fetches previous orders made through bibliotek.dk
 * @param {string} libraryCode
 * @param {string} userId
 */
export function checkOrderAllowed(input) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `borchk($input: BorchkInput!) {
        borchk(input: $input) {
        userId
        status
        municipalityNumber
        blocked
        }
    }`,
    variables: { input },
    slowThreshold: 3000,
  };
}

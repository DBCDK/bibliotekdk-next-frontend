/**
 * user authentication stuff
 */
import { ApiEnums } from "@/lib/api/api";

export function authentication() {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `query Authentication {
      user {
        isCPRValidated
        loggedInAgencyId
        identityProviderUsed
        hasCulrUniqueId
      }
      session {
        userParameters {
          cpr
          userId
          barcode
          cardno
          customId
          userDateOfBirth
          userName
          userAddress
          userMail
          userTelephone
        }
      }
    }
    `,
    slowThreshold: 3000,
    revalidate: true,
  };
}

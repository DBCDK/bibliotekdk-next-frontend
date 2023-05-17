/**
 * submits session data
 */
import { ApiEnums } from "@/lib/api/api";

export function submitSession(input) {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    mutation($input: SessionInput!) {
      submitSession(input: $input)
    }
    `,
    variables: { input },
    slowThreshold: 3000,
  };
}

/**
 * delete session data
 */
export function deleteSession() {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    mutation {
      deleteSession
    }`,
    slowThreshold: 3000,
  };
}

/**
 * get session data
 */
export function session() {
  return {
    apiUrl: ApiEnums.FBI_API,
    // delay: 1000, // for debugging
    query: `
    query session {
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
        pickupBranch
      }
      user {
        debt {
          title
          amount
          creator
          date
          currency
        }
        loans {
          loanId
          dueDate
          manifestation {
            pid
            titles {
              main
            }
            creators {
              display
            }
            materialTypes {
              specific
            }
            cover {
              thumbnail
            }
            recordCreationDate
          }
        }
        orders {
          orderId
          status
          pickUpBranch {
            agencyName
          }
          pickUpExpiryDate
          manifestation {
            pid
            titles {
              main
            }
            creators {
              display
            }
            materialTypes {
              specific
            }
            cover {
              thumbnail
            }
            recordCreationDate
          }
        }
      }
      monitor(name: "bibdknext_session")
    }`,
    variables: {},
    slowThreshold: 3000,
  };
}

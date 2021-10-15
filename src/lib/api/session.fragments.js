/**
 * submits session data
 */
export function submitSession(input) {
  return {
    // delay: 1000, // for debugging
    query: `mutation($input: SessionInput!) {
      submitSession(input: $input)
    }
    `,
    variables: { input },
    slowThreshold: 3000,
  };
}

export function deleteSession() {
  return {
    query: `mutation {
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
    // delay: 1000, // for debugging
    query: `query session {
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
      monitor(name: "bibdknext_session")
    }`,
    variables: {},
    slowThreshold: 3000,
  };
}

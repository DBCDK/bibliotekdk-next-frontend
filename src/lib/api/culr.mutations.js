export function createAccount({ tokens }) {
  return {
    query: `mutation CulrCreateAccount($input: CreateAccountInput!) {
        bibdk {
          culr {
            createAccount(input: $input, dryRun: false) {
              status
            }
          }
        }
      }`,
    variables: {
      input: {
        tokens,
      },
    },
  };
}

export function deleteAccount({ agencyId }) {
  return {
    query: `mutation CulrDeleteAccount($input: DeleteAccountInput!) {
        bibdk {
          culr {
            deleteAccount(input: $input, dryRun: false) {
              status
            }
          }
        }
      }`,
    variables: {
      input: {
        agencyId,
      },
    },
  };
}

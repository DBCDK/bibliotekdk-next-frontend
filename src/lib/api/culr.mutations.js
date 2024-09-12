export function createAccount({ tokens }) {
  return {
    query: `mutation CulrCreateAccount($input: CreateAccountInput!) {
        culr {
          bibdk {
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
        culr {
          bibdk {
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

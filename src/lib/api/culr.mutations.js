export function createAccount({ tokens }) {
  return {
    query: `mutation CulrCreateAccount($input: CreateAccountInput!) {
        culr {
          createAccount(input: $input, dryRun: false) {
            status
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
          deleteAccount(input: $input, dryRun: true) {
            status
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

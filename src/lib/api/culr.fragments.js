export function getAccounts() {
  return {
    query: `query CulrGetAccounts {
        culr {
          getAccounts {
            accounts {
              agencyId
            }
          }
        }
      }`,
    variables: {},
  };
}

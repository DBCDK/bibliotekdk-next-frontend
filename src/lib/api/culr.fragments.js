export function getAccounts() {
  return {
    query: `query CulrGetAccounts {
        culr {
          bibdk {
            getAccounts {
              accounts {
                agencyId
              }
            }
          }
        }
      }`,
    variables: {},
  };
}

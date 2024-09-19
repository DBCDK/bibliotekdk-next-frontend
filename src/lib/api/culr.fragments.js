export function getAccounts() {
  return {
    query: `query CulrGetAccounts {
        bibdk {
          culr {
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

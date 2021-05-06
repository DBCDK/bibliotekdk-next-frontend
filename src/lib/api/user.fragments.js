/**
 * @file Contains GraphQL queries all taking a workId as variable
 *
 */

/**
 * Basic user info
 *
 */
export function basic() {
  return {
    // delay: 1000, // for debugging
    query: `{
                user {
                    name
                    mail
                    address
                    postalCode
                    agency {
                        branches{
                            agencyId
                            name
                            branchId
                        }
                    }
                }
            }`,
    slowThreshold: 3000,
  };
}

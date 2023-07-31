//TODO maybe call user mutations?

/**
 * When user renew a loan
 *
 * @param {object} params
 * @param {string} params.loanId the loan id
 * @param {string} params.agencyId the agency id
 */

export function renewLoan({ loanId, agencyId }) {
  return {
    query: `
    mutation renewLoan($loanId: String!, $agencyId: String!) {
      renewLoan(loanId: $loanId, agencyId: $agencyId, dryRun: false) {
        renewed
        error
        dueDate
      }
    } 
    `,
    variables: {
      loanId,
      agencyId,
    },
  };
}

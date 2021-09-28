/**
 * When user searches and then clicks on work
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function submitOrder({ pids, branchId, userParameters }) {
  return {
    query: `mutation ($input: SubmitOrderInput!){
        submitOrder(input: $input){
          status
          orderId
        }
      }
      `,
    variables: {
      input: {
        pids,
        pickUpBranch: branchId,
        userParameters,
      },
    },
  };
}

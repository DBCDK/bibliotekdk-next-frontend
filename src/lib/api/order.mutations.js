/**
 * When user searches and then clicks on work
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function submitOrder({ pid, branchId }) {
  return {
    query: `mutation ($input: SubmitOrderInput!){
        submitOrder(input: $input){
          status
          orderId
          deleted
          orsId
        }
      }
      `,
    variables: {
      input: {
        pids: [pid],
        pickUpBranch: branchId,
      },
    },
  };
}

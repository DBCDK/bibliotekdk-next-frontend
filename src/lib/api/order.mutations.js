/**
 * When user searches and then clicks on work
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
export function submitOrder({
  pids,
  branchId,
  userParameters,
  publicationDateOfComponent,
  volume,
  authorOfComponent,
  titleOfComponent,
  pagination,
}) {
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
        publicationDateOfComponent,
        volume,
        authorOfComponent,
        titleOfComponent,
        pagination,
      },
    },
  };
}

export function submitPeriodicaArticleOrder({
  pid,
  pickUpBranch,
  userName,
  userMail,
  publicationDateOfComponent,
  volume,
  authorOfComponent,
  titleOfComponent,
  pagination,
}) {
  return {
    query: `mutation($input: PeriodicaArticleOrder!) {
        submitPeriodicaArticleOrder(input: $input) {
          status
        }
      }
      `,
    variables: {
      input: {
        pid,
        pickUpBranch,
        userName,
        userMail,
        publicationDateOfComponent,
        volume,
        authorOfComponent,
        titleOfComponent,
        pagination,
      },
    },
  };
}

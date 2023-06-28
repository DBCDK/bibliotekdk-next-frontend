/**
 * When user searches and then clicks on work
 *
 * @param {object} params
 * @param {string} params.workId the work id
 */
import { ApiEnums } from "@/lib/api/api";

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
    apiUrl: ApiEnums.FBI_API,
    query: `
    mutation ($input: SubmitOrderInput!){
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
  userName,
  userMail,
  publicationDateOfComponent,
  volume,
  authorOfComponent,
  titleOfComponent,
  pagination,
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    mutation ($input: CopyRequestInput!) {
      elba {
        placeCopyRequest(input: $input) {
          status
        }
      }
    }
      `,
    variables: {
      input: {
        pid,
        userName,
        userMail,
        publicationDateOfComponent,
        volumeOfComponent: volume,
        authorOfComponent,
        titleOfComponent,
        pagesOfComponent: pagination,
      },
    },
  };
}

/**
 * When user deletes an order/reservation
 *
 * @param {object} params
 * @param {string} params.orderId the order id
 * @param {string} params.agencyId the agency idª
 */

export function cancelOrder({ orderId, agencyId }) {
  return {
    query: `
    mutation cancelOrder($orderId: String!, $agencyId: String!) {
      deleteOrder(orderId: $orderId, agencyId: $agencyId, dryRun: false) {
        deleted
        error
      }
    } 
    `,
    variables: {
      orderId,
      agencyId,
    },
  };
}

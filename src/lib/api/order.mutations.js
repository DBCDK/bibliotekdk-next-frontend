/**
 * When user searches and then clicks on work
 *
 * @param {Object} params
 * @param {string} params.workId the work id
 */
import { ApiEnums } from "@/lib/api/api";

export function submitMultipleOrders({
  materialsToOrder,
  branchId,
  mobileLibrary,
  userParameters,
  pagination,
}) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `
    mutation ($input: SubmitMultipleOrdersInput!) {
      submitMultipleOrders(input: $input) {
        failedAtCreation
        successfullyCreated
        ok
      }
    }
    `,
    variables: {
      input: {
        materialsToOrder,
        pickUpBranch: branchId,
        pickUpBranchSubdivision: mobileLibrary,
        userParameters,
        pagination,
      },
    },
  };
}

export function submitOrder({
  pids,
  branchId,
  userParameters,
  publicationYearOfComponent,
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
        message
        orderId
        ok
      }
    }
    `,
    variables: {
      input: {
        pids,
        pickUpBranch: branchId,
        userParameters,
        publicationYearOfComponent,
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
  publicationYearOfComponent,
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
        publicationYearOfComponent,
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
 * @param {Object} params
 * @param {string} params.orderId the order id
 * @param {string} params.agencyId the agency idª
 */

export function deleteOrder({ orderId, agencyId }) {
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

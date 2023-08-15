import { ApiEnums } from "@/lib/api/api";

/**
 *
 * @param {String []} orderIds
 * @returns Query for fethcing order data for the given order ids
 */
export function orderStatus({ orderIds }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query getOrderStatus($orderIds: [String!]!) {
        orderStatus(orderIds: $orderIds) {
          autoForwardResult
          placeOnHold
          orderId
          pickupAgencyId
          pid
          closed
          creationDate
          author
          title
        }
      }`,
    variables: { orderIds: orderIds },
    slowThreshold: 3000,
  };
}

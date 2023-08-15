export function orderStatus({ orderIds }) {
  return {
    apiUrl: ApiEnums.FBI_API,
    query: `query getOrderStatus($orderIds: [String]!) {
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
    variables: {orderIds },
    slowThreshold: 3000,
  };
}

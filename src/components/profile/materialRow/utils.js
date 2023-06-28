import * as orderMutations from "@/lib/api/order.mutations";

export async function handleCancelOrder(orderId, agencyId, orderMutation) {
  return orderMutation.post(
    orderMutations.cancelOrder({
      orderId,
      agencyId,
    })
  );
}

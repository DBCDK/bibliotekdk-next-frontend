import * as orderMutations from "@/lib/api/order.mutations";
import Translate from "@/components/base/translate";

export async function handleCancelOrder(orderId, agencyId, orderMutation) {
  orderMutation.post(
    orderMutations.cancelOrder({
      orderId,
      agencyId,
    })
  );
}

/**
 * Opens delete order modal
 * @param {*} param0.modal
 * @param {boolean} param0.mobile
 * @param {Date} param0.pickUpExpiryDate
 * @param {string} param0.id
 * @param {string} param0.agencyId
 * @param {string} param0.orderMutation
 * @returns success status, error message
 */
export function onClickDelete({
  modal,
  mobile,
  pickUpExpiryDate,
  id,
  agencyId,
  orderMutation,
  onCloseModal,
}) {
  modal.push("deleteOrder", {
    label: Translate({ context: "profile", label: "delete-order" }),
    mobile: mobile,
    isReadyToPickup: !!pickUpExpiryDate,
    orderId: id,
    agencyId: agencyId,
    orderMutation: orderMutation,
    onClose: onCloseModal,
  });
}

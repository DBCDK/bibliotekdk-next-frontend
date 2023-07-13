import * as orderMutations from "@/lib/api/order.mutations";
import Translate from "@/components/base/translate";

export function handleDeleteOrder(orderId, agencyId, orderMutation) {
  orderMutation.post(
    orderMutations.deleteOrder({
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
 * @param {string} param0.materialId
 * @param {string} param0.agencyId
 * @param {string} param0.orderMutation
 * @returns success status, error message
 */
export function onClickDelete({
  modal,
  mobile,
  pickUpExpiryDate,
  materialId,
  agencyId,
  orderMutation,
  onCloseModal,
  title,
}) {
  modal.push("deleteOrder", {
    label: Translate({ context: "profile", label: "delete-order" }) + "?",
    mobile: mobile,
    isReadyToPickup: !!pickUpExpiryDate,
    orderId: materialId,
    agencyId: agencyId,
    orderMutation: orderMutation,
    onClose: onCloseModal,
    title,
  });
}

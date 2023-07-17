import * as orderMutations from "@/lib/api/order.mutations";
import Translate from "@/components/base/translate";

export function handleDeleteOrder(orderId, agencyId, orderAndLoansMutation) {
  orderAndLoansMutation.post(
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
 * @param {string} param0.title
 * @param {*} param0.onCloseModal
 * @param {string} param0.orderAndLoansMutation
 * @returns success status, error message
 */
export function onClickDelete({
  modal,
  mobile,
  pickUpExpiryDate,
  materialId,
  agencyId,
  orderAndLoansMutation,
  onCloseModal,
  title,
}) {
  modal.push("deleteOrder", {
    label: Translate({
      context: "profile",
      label: "delete-order-questionmark",
    }),
    mobile: mobile,
    isReadyToPickup: !!pickUpExpiryDate,
    orderId: materialId,
    agencyId: agencyId,
    orderAndLoansMutation: orderAndLoansMutation,
    onClose: onCloseModal,
    title,
  });
}

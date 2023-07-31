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
 * @param {obj} modal
 * @param {boolean} mobile
 * @param {Date} pickUpExpiryDate
 * @param {string} materialId
 * @param {string} agencyId
 * @param {string} title
 * @param {obj} orderMutation
 */
export function onClickDelete({
  modal,
  mobile,
  pickUpExpiryDate,
  materialId,
  agencyId,
  orderMutation,
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
    orderMutation,
    title,
  });
}

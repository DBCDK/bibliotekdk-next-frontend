import * as loanMutations from "@/lib/api/loans.mutations";

export function handleRenewLoan({ loanId, agencyId, loanMutation }) {
  loanMutation.post(
    loanMutations.renewLoan({
      loanId,
      agencyId,
    })
  );
}

/**
 * handles updates in mutation object on loans and reservations page
 * Its called in two places, depending on if on desktop or mobile
 * @param {obj} loanMutation
 * @param {function} setHasError
 * @param {function} setRenewed
 * @param {function} setRenewedDueDateString
 */
export async function handleLoanMutationUpdates(
  loanMutation,
  setHasError,
  setRenewed,
  setRenewedDueDateString
) {
  const { error, data } = loanMutation;
  //error not handled inside fbi-api or error while mutating
  if (error) {
    console.log("HAS ERROR");
    setHasError(true);
  }
  if (data) {
    console.log("HAS DATA");
    if (data?.renewLoan?.renewed && data?.renewLoan?.dueDate) {
      console.log("HAS OFFICIAL ERROR");

      setRenewed(true);
      setRenewedDueDateString(data.renewLoan.dueDate);
    } else {
      console.log("HAS UNOFFICIAL ERROR");
      setHasError(true);
    } //error handled inside fbi-api
  }
}

/**
 * handles updates in mutation object on loans and reservations page
 * Its called in two places, depending on if on desktop or mobile
 * @param {boolean} desktop
 * @param {obj} loanMutation
 * @param {function} setHasError
 * @param {function} setHasErrorList
 * @param {function} setRemovedOrderId
 * @param {function} updateUserStatusInfo
 */
export async function handleOrderMutationUpdates(
  desktop,
  orderMutation,
  setHasError,
  setHasErrorList = undefined, // provided only for mobile to show error on orderslist
  setRemovedOrderId = undefined, // provided on delete order
  updateUserStatusInfo = undefined //rerender on delete order
) {
  const { error, data } = orderMutation;
  //error not handled inside fbi-api or error while mutating
  if (error) {
    setHasError(true);
    if (!desktop && setHasErrorList) setHasErrorList(true);
  }
  if (data) {
    if (data?.deleteOrder?.deleted) {
      setRemovedOrderId();
      await updateUserStatusInfo("ORDER");
    } else setHasError(true); //error handled inside fbi-api
  }
}

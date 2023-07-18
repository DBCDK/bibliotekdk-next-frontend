import * as loanMutations from "@/lib/api/loans.mutations";

export function handleRenewOrder({ loanId, agencyId, orderAndLoansMutation }) {
  orderAndLoansMutation.post(
    loanMutations.renewLoan({
      loanId,
      agencyId,
    })
  );
}

/**
 * handles updates in mutation object on loans and reservations page
 * Its called in two places, depending on if on desktop or mobile
 * @param {boolean} desktop
 * @param {obj} orderAndLoansMutation
 * @param {function} setHasError
 * @param {function} setRenewed
 * @param {function} setRenewedDueDateString
 * @param {function} setHasErrorList
 * @param {function} setRemovedOrderId
 * @param {function} updateUserStatusInfo
 */
export async function handleMutationUpdates(
  desktop,
  orderAndLoansMutation,
  setHasError,
  setRenewed,
  setRenewedDueDateString,
  setHasErrorList = undefined, // provided only for mobile to show error on orderslist
  setRemovedOrderId = undefined, // provided on delete order
  updateUserStatusInfo = undefined //rerender on delete order
) {
  //error not handled inside fbi-api or error while mutating
  if (orderAndLoansMutation.error) {
    setHasError(true);
    if (!desktop && setHasErrorList) setHasErrorList(true);
  }
  if (orderAndLoansMutation.data) {
    if (orderAndLoansMutation.data?.deleteOrder?.deleted) {
      setRemovedOrderId();
      await updateUserStatusInfo("ORDER");
    } else if (
      orderAndLoansMutation.data?.renewLoan?.renewed &&
      orderAndLoansMutation.data?.renewLoan?.dueDate
    ) {
      setRenewed(true);
      setRenewedDueDateString(orderAndLoansMutation.data.renewLoan.dueDate);
    } else setHasError(true); //error handled inside fbi-api
  }
}

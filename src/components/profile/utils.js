import * as loanMutations from "@/lib/api/loans.mutations";

export function handleRenewOrder({ loanId, agencyId, orderMutation }) {
  orderMutation.post(
    loanMutations.renewLoan({
      loanId,
      agencyId,
    })
  );
}

/**
 * handles updates in mutation object on loans and reservations page
 * Its called in two places, depending on if on desktop or mobile
 * @param {*} orderMutation
 * @param {*} setHasError
 * @param {*} setRenewed
 * @returns
 */
export function handleMutationUpdates(
  orderMutation,
  setHasError,
  setRenewed,
  setRenewedDueDateString
) {
  //error not handled inside fbi-api or error while mutating
  if (orderMutation.error) {
    setHasError(true);
    return;
  }
  if (orderMutation.data) {
    if (orderMutation.data.renewLoan?.renewed) {
      setRenewed(true);
      if (setRenewedDueDateString)
        //set on desktop but not for mobile
        setRenewedDueDateString(orderMutation.data.renewLoan.dueDate);
    } else setHasError(true); //error handled inside fbi-api
  }
}

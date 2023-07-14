import * as loanMutations from "@/lib/api/loans.mutations";

export function handleRenewOrder({ loanId, agencyId, orderMutation }) {
  console.log("handleRenewOrder", loanId, agencyId);
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
export function handleMutationUpdates(orderMutation, setHasError, setRenewed) {
  //error not handled inside fbi-api or error while mutating
  if (orderMutation.error) {
    setHasError(true);
    return;
  }
  if (orderMutation.data) {
    if (orderMutation.data.renewed) {
      setRenewed(true);
    } else setHasError(true); //error handled inside fbi-api
  }
}

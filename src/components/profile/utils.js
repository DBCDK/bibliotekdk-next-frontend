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
 * @param {*} orderAndLoansMutation
 * @param {*} setHasError
 * @param {*} setRenewed
 * @returns
 */
export function handleMutationUpdates(
  orderAndLoansMutation,
  setHasError,
  setRenewed,
  setRenewedDueDateString = null
) {
  //error not handled inside fbi-api or error while mutating
  if (orderAndLoansMutation.error) {
    setHasError(true);
    return;
  }
  if (orderAndLoansMutation.data) {
    if (
      orderAndLoansMutation.data?.renewLoan?.renewed ||
      orderAndLoansMutation.data?.deleteOrder?.deleted
    ) {
      setRenewed(true);
      if (
        setRenewedDueDateString &&
        orderAndLoansMutation.data?.renewLoan?.dueDate
      )
        //for loan renewals only on desktop but not for mobile, bc
        //on mobile we update the modal with dueDate from mutation object & we rerender loans page, once the modal is closed
        setRenewedDueDateString(orderAndLoansMutation.data.renewLoan.dueDate);
    } else setHasError(true); //error handled inside fbi-api
  }
}

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
 * @param {function} setHasRenewError
 * @param {function} setRenewed
 * @param {function} setRenewedDueDateString
 */
export async function handleLoanMutationUpdates(
  loanMutation,
  setHasRenewError,
  setRenewed,
  setRenewedDueDateString
) {
  const { error, data, isLoading } = loanMutation;

  if (isLoading) return;
  //error not handled inside fbi-api or error while mutating
  if (error) {
    console.log("HAS ERROR");
    setHasRenewError(true);
    return;
  }
  if (data?.renewLoan?.renewed && data?.renewLoan?.dueDate) {
    setRenewed(true);
    setRenewedDueDateString(data.renewLoan.dueDate);
  }
  if (data?.renewLoan?.renewed === false) {
    //error handled inside fbi-api
    console.log("INSIDE");
    setHasRenewError(true);
  }
}

/**
 * handles updates in mutation object on loans and reservations page
 * Its called in two places, depending on if on desktop or mobile
 * @param {obj} loanMutation
 * @param {function} setHasError
 * @param {function} setRemovedOrderId
 * @param {function} updateUserStatusInfo
 */
export async function handleOrderMutationUpdates(
  orderMutation,
  setHasError,
  setRemovedOrderId,
  updateUserStatusInfo
) {
  const { error, data, isLoading } = orderMutation;

  if (isLoading) {
    return;
  }

  //error not handled inside fbi-api or error while mutating
  if (error) {
    setHasError(true);
    return;
  }

  //order was successfully deleted
  if (data?.deleteOrder?.deleted) {
    console.log("DELETED", setRemovedOrderId);
    setRemovedOrderId();
    await updateUserStatusInfo("ORDER");
    return;
  }
  //error deleting order inside fbi-api
  if (data?.deleteOrder?.deleted === false) {
    setHasError(true);
  }
}

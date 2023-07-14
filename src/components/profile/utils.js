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

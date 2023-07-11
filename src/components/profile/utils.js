import * as loanMutations from "@/lib/api/loans.mutations";

export function handleRenewOrder({ loanId, agencyId, orderMutation }) {
  orderMutation.post(
    loanMutations.renewLoan({
      loanId,
      agencyId,
    })
  );
}

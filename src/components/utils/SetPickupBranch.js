import { useEffect } from "react";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

export default function SetPickupBranch({ router }) {
  // the useeffect below updates user pickupbranch after a login from loanerform.
  // when user logs in via adgangplatform a pickupbranch is set in callbackurl
  // @see LoanerForm.js
  const { updateLoanerInfo } = useLoanerInfo();

  useEffect(() => {
    if (router.query.setPickupAgency) {
      updateLoanerInfo({ pickupBranch: router.query.setPickupAgency });
      // pickup agency has been set
      let query = { ...router.query };
      delete query.setPickupAgency;
      router?.replace({ pathname: router.pathname, query });
    }
  }, []);

  return null;
}

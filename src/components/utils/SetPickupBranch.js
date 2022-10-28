import { useRouter } from "next/router";
import { useEffect } from "react";
import useUser from "@/components/hooks/useUser";

export default function SetPickupBranch({ router }) {
  // the useeffect below updates user pickupbranch after a login from loanerform.
  // when user logs in via adgangplatform a pickupbranch is set in callbackurl
  // @see LoanerForm.js
  const { updateLoanerInfo } = useUser();

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

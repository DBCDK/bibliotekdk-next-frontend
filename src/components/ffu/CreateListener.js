import { useEffect } from "react";

import useVerification from "@/components/hooks/useVerification";
import useUser from "@/components/hooks/useUser";
import { useModal } from "@/components/_modal";

import { createAccount } from "@/lib/api/culr.mutations";
import { getAccounts } from "@/lib/api/culr.fragments";

import { useData, useMutate } from "@/lib/api/api";

export default function Listener() {
  const user = useUser();
  const verification = useVerification();
  const culrMutation = useMutate();
  const modal = useModal();

  // mutation details
  const { data: mutate, isLoading, error } = culrMutation;

  // user details
  const { isAuthenticated, hasCulrUniqueId, isCPRValidated, isLoggedIn } = user;

  // verification data
  const data = verification.read();

  const hasValidVerificationProcess = !!(data && data?.tokens?.ffu);

  console.log("xxx Debug CREATE Listener ....", {
    isLoggedIn,
    isAuthenticated,
    hasCulrUniqueId,
    hasValidVerificationProcess,
    status:
      isLoggedIn &&
      isAuthenticated &&
      hasCulrUniqueId &&
      isCPRValidated &&
      hasValidVerificationProcess,
  });

  // Mutate createAccount response from API
  useEffect(() => {
    if (mutate?.culr?.createAccount?.status === "OK") {
      // Delete verification
      verification.delete();
    }

    // Some error occured
    if (mutate?.culr?.createAccount?.status.includes("ERROR")) {
      modal.push("statusMessage", {
        title: "Noget gik galt :(",
        text: "Noget gik desværre galt, prøv igen eller kontakt support blah blah...",
      });
    }
  }, [mutate]);

  // CreateAccount post action to API
  useEffect(() => {
    // if user is signed in
    if (isLoggedIn) {
      // User is authenticated through adgangsplatformen
      if (isAuthenticated) {
        // User has no culr account (not created in culr)
        if (hasCulrUniqueId) {
          // if user is CPR validated
          if (isCPRValidated) {
            // Users has an active verification process - verification is less than 60 minutes old
            if (hasValidVerificationProcess) {
              culrMutation.post(createAccount(data));
            }
          }
        }
      }
    }
  }, [isLoggedIn, isCPRValidated, hasValidVerificationProcess]);

  //   const { data: culrData, error: culrError } = useData(fetch && getAccounts());

  //   useEffect(() => {
  //     if (culrData || culrError) {
  //       setFetch(false);
  //     }
  //   }, [culrData, culrError]);

  return null;
}

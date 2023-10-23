import { useEffect } from "react";

import useVerification from "@/components/hooks/useVerification";
import useUser from "@/components/hooks/useUser";
import { useModal } from "@/components/_modal";
import Translate from "@/components/base/translate";

import { createAccount } from "@/lib/api/culr.mutations";

import { useMutate } from "@/lib/api/api";

export default function Listener() {
  const user = useUser();
  const verification = useVerification();
  const culrMutation = useMutate();
  const modal = useModal();

  // mutation details
  const { data: mutate, error } = culrMutation;

  // user details
  const {
    isAuthenticated,
    hasCulrUniqueId,
    isCPRValidated,
    isLoggedIn,
    updateUserData,
  } = user;

  // verification data
  const data = verification.read();

  const hasValidVerificationProcess = !!(data && data?.tokens?.ffu);

  // Mutate createAccount response from API
  useEffect(() => {
    const status = mutate?.culr?.createAccount?.status;

    if (status === "OK") {
      // Delete verification
      verification.delete();
      // broadcast user changes
      updateUserData();
    }

    // Some error occured
    if (status?.includes("ERROR") || error) {
      // default error message
      let title = "titleError";
      let text = "textError";

      // CPR mismatch - 'folk' and 'bearer' token CPR doesn't match.
      if (status === "ERROR_CPR_MISMATCH") {
        title = "titleError";
        text = "textError";
      }

      // trigger error modal
      modal.push("statusMessage", {
        title: Translate({
          context: "addLibrary",
          label: title,
        }),
        text: Translate({
          context: "addLibrary",
          label: text,
        }),
      });
    }
  }, [mutate, error]);

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

  return null;
}

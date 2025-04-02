/**
 * @file Listens for FFu users which just finished the verification processs
 * - this file contains the functionality that actually creates the user in culr
 */

import { useEffect } from "react";

import Router from "next/router";

import useVerification from "@/components/hooks/useVerification";
import useUser from "@/components/hooks/useUser";
import { useModal } from "@/components/_modal";
import Translate from "@/components/base/translate";

import { createAccount } from "@/lib/api/culr.mutations";

import { useMutate } from "@/lib/api/api";
import useAuthentication from "../hooks/user/useAuthentication";

export default function Listener() {
  const user = useUser();
  const { isCPRValidated } = useAuthentication();
  const verification = useVerification();
  const culrMutation = useMutate();
  const modal = useModal();

  // mutation details
  const { data: mutate, reset, error } = culrMutation;

  // user details
  const { updateUserData } = user;
  const { hasCulrUniqueId } = useAuthentication();

  // verification data
  const data = verification.read();

  const hasValidVerificationProcess = !!(data && data?.tokens?.ffu);

  // Mutate createAccount response from API
  useEffect(() => {
    const status = mutate?.bibdk?.culr?.createAccount?.status;

    if (status || error) {
      if (status === "OK") {
        // broadcast user changes
        updateUserData();

        const isActive = modal.isVisible;

        // Redirect user to my libraries page if no modal is active (e.g. user is in a order process)
        if (!isActive) {
          Router.push("/profil/mine-biblioteker");
        }
      }

      // Some error occured
      if (status?.includes("ERROR") || error) {
        // default error message
        let title = "titleError";
        let text = "textError";

        // CPR mismatch - 'folk' and 'bearer' token CPR doesn't match.
        if (status === "ERROR_CPR_MISMATCH") {
          title = "titleErrorCPRMismatch";
          text = "textErrorCPRMismatch";
        }

        // Prevent multiple modal push
        if (modal.index("statusMessage") < 0) {
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
      }

      // Cleanup

      // Reset mutation response
      reset();

      // Delete verification
      // verification.delete();
    }
  }, [mutate, modal.isVisible, error]);

  // CreateAccount post action to API
  useEffect(() => {
    // User has no culr account (not created in culr)
    if (!hasCulrUniqueId) {
      return;
    }

    // User is NOT CPR validated
    if (!isCPRValidated) {
      return;
    }

    // Users has NO active verification process
    if (!hasValidVerificationProcess) {
      return;
    }

    // Create User in CULR
    culrMutation.post(createAccount(data));
  }, [hasCulrUniqueId, isCPRValidated, hasValidVerificationProcess]);

  return null;
}

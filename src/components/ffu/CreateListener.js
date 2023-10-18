import { useEffect } from "react";

import useVerification from "@/components/hooks/useVerification";
import useUser from "@/components/hooks/useUser";

import { createAccount } from "@/lib/api/culr.mutations";
import { useMutate } from "@/lib/api/api";

export default function Listener() {
  const user = useUser();
  const verification = useVerification();
  const culrMutation = useMutate();

  // mutation details
  const { data: mutate, isLoading, error } = culrMutation;

  // user details
  const {
    authUser,
    isAuthenticated,
    hasCulrUniqueId,
    isCPRValidated,
    isLoggedIn,
    updateUserData,
  } = user;

  console.log("uuuuuuser", user);

  // verification data
  const data = verification.read();

  console.log(data);

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
    const updateUser = () => {
      setTimeout(() => updateUserData(), 15000);
    };

    console.log("xxx mutate", mutate, authUser, user);

    if (mutate?.culr?.createAccount?.status === "OK") {
      // Delete verification
      verification.delete();
      //  update user
      updateUser();
    }
  }, [mutate, authUser]);

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

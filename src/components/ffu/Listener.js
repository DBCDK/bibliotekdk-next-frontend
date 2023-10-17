import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useVerification from "@/components/hooks/useVerification";
import { useAccessToken } from "@/components/hooks/useUser";
import useUser from "@/components/hooks/useUser";
import { useModal } from "@/components/_modal";

import { isFFUAgency } from "@/utils/agency";

export default function Listener() {
  const user = useUser();

  const { authUser, loanerInfo, isAuthenticated, hasCulrUniqueId, isLoggedIn } =
    user;

  const agencyId = authUser?.loggedInBranchId;
  const branchId = loanerInfo?.pickupBranch;
  const agencies = authUser?.agencies;

  const accessToken = useAccessToken();
  const verification = useVerification();
  const modal = useModal();

  const hasVerificationProcess = verification.exist();

  console.log("Debug Listener ....", {
    isLoggedIn,
    agencyId,
    isAuthenticated,
    hasCulrUniqueId,
    hasVerificationProcess,
  });

  useEffect(() => {
    // if user is signed in
    if (isLoggedIn) {
      // User is authenticated through adgangsplatformen
      if (isAuthenticated) {
        // User has no culr account (not created in culr)
        if (!hasCulrUniqueId) {
          // The agency which the user has signedIn to, is an FFU library
          if (agencyId && isFFUAgency(agencyId)) {
            // Users doesnt have an active verification - verification is more than 24 hours old
            if (!hasVerificationProcess) {
              // Select the loggedInBranch from users agencies list
              let match = {};
              agencies?.forEach((agency) => {
                match = agency?.result?.find(
                  (branch) => branch.branchId === branchId
                );
              });

              // if pickupBranch match found
              if (match) {
                const context = {
                  agencyId: match?.agencyId,
                  agencyName: match?.agencyName,
                  branchId: match?.branchId,
                };

                verification.create({
                  accessToken,
                  type: "FFU",
                  origin: "listener",
                });

                // Fire the create bibdk account modal
                modal.push("verify", context);
              }
            }
          }
        }
      }
    }
  }, [isLoggedIn, hasVerificationProcess, branchId, agencies]);

  return null;
}

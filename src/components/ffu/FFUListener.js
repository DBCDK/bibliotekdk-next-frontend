import { useEffect } from "react";

import useVerification from "@/components/hooks/useVerification";
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

  const verification = useVerification();
  const modal = useModal();

  const hasVerificationObject = verification.exist();

  console.log("Debug FFU Listener ....", {
    isLoggedIn,
    agencyId,
    isAuthenticated,
    hasCulrUniqueId,
    hasVerificationObject,
    status:
      isLoggedIn &&
      isAuthenticated &&
      !hasCulrUniqueId &&
      agencyId &&
      isFFUAgency(agencyId) &&
      !hasVerificationObject,
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
            if (!hasVerificationObject) {
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

                // create verification process (lasts 24 hours)
                // can be used within 60 minutes
                verification.create({
                  origin: "listener",
                });

                /* if verify modal is not already triggered
                 *
                 * Note: bug happens when deleting storage and
                 * refreshing page when modal is open
                 */
                if (modal.index("verify") < 0) {
                  // Fire the create bibdk account modal
                  modal.push("verify", context);
                }
              }
            }
          }
        }
      }
    }
  }, [isLoggedIn, branchId, agencies]);

  return null;
}

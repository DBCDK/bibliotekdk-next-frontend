/**
 * @file Listens for FFU user logins (via ffu agency) which already has a bibdk profile attached.
 */

import { useEffect, useMemo } from "react";

import { useModal } from "@/components/_modal";

import { isFFUAgency, getBranchFromAgencies } from "@/utils/agency";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import useStorage from "../hooks/useStorage";
import useVerification from "../hooks/useVerification";

export default function Listener() {
  const { isAuthenticated, loggedInAgencyId, loggedInBranchId } =
    useAuthentication();
  const { loanerInfo } = useLoanerInfo();

  const storage = useStorage();

  const verification = useVerification();

  const hasVerificationObject = verification.exist();

  const agencyId = loggedInAgencyId;
  const branchId = loggedInBranchId;
  const agencies = loanerInfo?.agencies;

  // Select the loggedInBranch from users agencies list
  const match = useMemo(
    () => getBranchFromAgencies(branchId, agencies),
    [branchId, agencies]
  );

  const hasOmittedCulrData =
    !!loanerInfo?.omittedCulrData?.hasOmittedCulrUniqueId;

  const hasBlockedFFuListener = !!storage.read("BlockFFUProfileListener");

  const modal = useModal();

  useEffect(() => {
    if (hasVerificationObject) {
      return;
    }

    // If The agency which the user has signedIn to, is NOT an FFU library
    if (!(agencyId && isFFUAgency(match))) {
      return;
    }

    // If user data is NOT stripped for CULR informations
    // culr data is removed, if the FFU authentication is only made through borchk.
    if (!hasOmittedCulrData) {
      return;
    }

    // user was already prompted and is still within the given expiration date
    if (hasBlockedFFuListener) {
      return;
    }

    // if pickupBranch match found
    if (match) {
      /* if accontAlreadyInUse modal is not already triggered
       *
       * Note: bug happens when deleting storage and
       * refreshing page when modal is open
       */
      if (modal.index("accountHasProfile") < 0) {
        // Ensure other modals are initialized before 'accontAlreadyInUse' push
        // - Used at login in order.modal e.g.
        setTimeout(() => {
          // Fire the create bibdk account modal
          modal.push("accountHasProfile", {
            agencyId: match?.agencyId,
            agencyName: match?.agencyName,
            branchName: match?.name,
          });
        }, 500);
      }
    }
  }, [
    isAuthenticated,
    hasVerificationObject,
    hasOmittedCulrData,
    branchId,
    agencies,
  ]);

  return null;
}

/**
 * @file Listens for FFU user logins (via ffu agency) which already has a bibdk profile attached.
 */

import { useEffect } from "react";

import { useModal } from "@/components/_modal";

import { isFFUAgency } from "@/utils/agency";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

export default function Listener() {
  const { isAuthenticated, loggedInAgencyId } = useAuthentication();
  const { loanerInfo } = useLoanerInfo();

  const agencyId = loggedInAgencyId;
  const branchId = loanerInfo?.pickupBranch;
  const agencies = loanerInfo?.agencies;

  const hasOmittedCulrData =
    !!loanerInfo?.omittedCulrData?.hasOmittedCulrUniqueId;

  const modal = useModal();

  useEffect(() => {
    // If The agency which the user has signedIn to, is NOT an FFU library
    if (!(agencyId && isFFUAgency(agencyId))) {
      return;
    }

    // If user data is NOT stripped for CULR informations
    // culr data is removed, if the FFU authentication is only made through borchk.
    if (!hasOmittedCulrData) {
      return;
    }

    // Select the loggedInBranch from users agencies list
    let match = {};
    agencies?.forEach((agency) => {
      match = agency?.result?.find((branch) => branch.branchId === branchId);
    });

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
  }, [isAuthenticated, hasOmittedCulrData, branchId, agencies]);

  return null;
}

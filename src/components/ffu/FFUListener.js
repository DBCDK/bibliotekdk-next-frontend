/**
 * @file Listens for FFU user logins which potentially colud be created in CULR (Get a bibdk account)
 */

import { useEffect } from "react";

import useVerification from "@/components/hooks/useVerification";
import useUser from "@/components/hooks/useUser";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal";

import { isFFUAgency } from "@/utils/agency";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import useStorage from "@/components/hooks/useStorage";

export default function Listener() {
  const { isAuthenticated, hasCulrUniqueId, loggedInAgencyId } =
    useAuthentication();
  const user = useUser();

  const { authUser } = user;
  const { loanerInfo, isLoading } = useLoanerInfo();

  const agencyId = loggedInAgencyId;
  const branchId = loanerInfo?.pickupBranch;
  const agencies = authUser?.agencies;

  const verification = useVerification();
  const storage = useStorage();
  const modal = useModal();

  const hasOmittedCulrData =
    !!loanerInfo.omittedCulrData?.hasOmittedCulrUniqueId;

  const hasBlockedFFuListener = storage.read("BlockFFUListener");

  const hasVerificationObject = verification.exist();

  useEffect(() => {
    if (!isLoading && loanerInfo) {
      // User is NOT authenticated through adgangsplatformen
      if (!isAuthenticated) {
        return;
      }

      // User already has a uniqueId account (exist in culr)
      if (hasCulrUniqueId) {
        return;
      }

      // If The agency which the user has signedIn to, is NOT an FFU library
      if (!(agencyId && isFFUAgency(agencyId))) {
        return;
      }

      // If user has omitted culr data
      // user already exist in CULR, but data is not returned for security reasons (FFU borchk login)
      if (hasOmittedCulrData) {
        return;
      }

      // Users already has an active verification - verification is more than 24 hours old
      if (hasVerificationObject) {
        return;
      }

      // user has clicked "Don't show me this again" button in listener modal and is still within the given expiration date
      if (hasBlockedFFuListener) {
        return;
      }

      // Select the loggedInBranch from users agencies list
      let match = {};
      agencies?.forEach((agency) => {
        match = agency?.result?.find((branch) => branch.branchId === branchId);
      });

      // if pickupBranch match found
      if (match) {
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
          // Ensure other modals are initialized before 'verify' push
          // - Used at login in order.modal e.g.
          setTimeout(() => {
            // Fire the create bibdk account modal
            modal.push("verify", {
              agencyId: match?.agencyId,
              agencyName: match?.agencyName,
              branchId: match?.branchId,
              title: Translate({
                context: "addLibrary",
                label: "verificationTitle",
                vars: [match?.agencyName],
              }),
              text: Translate({
                context: "addLibrary",
                label: "verificationText",
                vars: [match?.agencyName],
              }),
            });
          }, 500);
        }
      }
    }
  }, [isAuthenticated, loanerInfo, isLoading, branchId, agencies]);

  return null;
}

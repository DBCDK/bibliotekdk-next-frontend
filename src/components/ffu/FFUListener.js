/**
 * @file Listens for FFU user logins which potentially colud be created in CULR (Get a bibdk account)
 */

import { useEffect, useMemo, useRef } from "react";

import useVerification from "@/components/hooks/useVerification";
import Translate from "@/components/base/translate";
import { useModal } from "@/components/_modal";

import { isFFUAgency, getBranchFromAgencies } from "@/utils/agency";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import useStorage from "@/components/hooks/useStorage";

export default function Listener() {
  const {
    isAuthenticated,
    hasCulrUniqueId,
    loggedInAgencyId,
    loggedInBranchId,
    isLoading: isAuthenticatedIsLoading,
  } = useAuthentication();

  const { loanerInfo, isLoading: loanerInfoIsLoading } = useLoanerInfo();

  const agencyId = loggedInAgencyId;
  const branchId = loggedInBranchId;
  const agencies = loanerInfo?.agencies;

  // Select the loggedInBranch from users agencies list
  const match = useMemo(
    () => getBranchFromAgencies(branchId, agencies),
    [branchId, agencies]
  );

  const verification = useVerification();
  const storage = useStorage();
  const modal = useModal();

  const hasOmittedCulrData =
    !!loanerInfo?.omittedCulrData?.hasOmittedCulrUniqueId;

  const hasBlockedFFuListener = storage.read("BlockFFUCreateListener");

  const hasVerificationObject = verification.exist();

  const isCreating = useRef({});

  const dataIsReady =
    !isAuthenticatedIsLoading &&
    !verification.isLoading &&
    !loanerInfoIsLoading &&
    !!loanerInfo;

  useEffect(() => {
    if (dataIsReady) {
      // User is NOT authenticated through adgangsplatformen
      if (!isAuthenticated) {
        return;
      }

      // User already has a uniqueId account (exist in culr)
      if (hasCulrUniqueId) {
        return;
      }

      // If The agency which the user has signedIn to, is NOT an FFU library
      if (!(agencyId && isFFUAgency(match))) {
        return;
      }

      // If agency automatically syncs data with culr
      if (match.culrDataSync) {
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

      // return if already creating a verfication process
      if (!isCreating.current) {
        return;
      }

      // if pickupBranch match found
      if (match) {
        // Set isCreating to true, to prevent multiple verification.create calls
        isCreating.current = true;

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
  }, [isAuthenticated, dataIsReady, branchId, agencies, modal?.stack?.length]);

  return null;
}

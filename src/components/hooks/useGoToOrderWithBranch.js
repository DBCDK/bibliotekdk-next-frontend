/**
 * @file
 * This file provides the hook useGoToOrderWithBranch that helpt
 */

import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useMemo } from "react";
import { accessFactory } from "@/lib/accessFactoryUtils";
import uniq from "lodash/uniq";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";

import { handleOnSelect } from "@/components/_modal/utils";
import { useModal } from "@/components/_modal";
import { openOrderModal } from "@/components/work/utils";

/**
 * useGoToOrderWithBranch provides a function called handleOnSelectEnriched. handleOnSelectEnriched uses handleOnSelect
 * to allow user to go to order modal, adgangsplatformen modal, or loanerForm modal, based on userInfo and branch borrowerCheck
 *
 * @param context
 * @param selectedPids
 * @param branchWithoutBorrowerCheck
 * @param workId
 * @returns {{borrowerCheckIsLoading, handleOnSelectEnriched: ((function(): Promise<void>)|*)}}
 */
export function useGoToOrderWithBranch({
  context,
  selectedPids,
  branchWithoutBorrowerCheck,
  workId,
}) {
  const modal = useModal();
  const { singleManifestation } = context;

  // Manifestations used to get access
  const { manifestations } = useGetManifestationsForOrderButton(
    workId,
    selectedPids
  );

  // Access (allEnrichedAccesses) is used to open Order modal
  const { allEnrichedAccesses } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );

  // pids from allEnrichedAccesses is used to open Order modal
  const pids = uniq(
    allEnrichedAccesses?.map((singleAccess) => singleAccess?.pid)
  );
  //

  // BranchId is used to get borrowerCheck for branch
  const branchId = branchWithoutBorrowerCheck?.branchId;

  // BorrowerCheck data is used to enrich branch with data on borrowerCheck
  const { data: borrowerCheckData, isLoading: borrowerCheckIsLoading } =
    useData(
      branchId && branchesFragments.borrowerCheck({ branchId: branchId })
    );

  // Branch needs to be enriched with BorrowerCheck, and we fetch it here because it is a slow fetch
  const branch = {
    ...branchWithoutBorrowerCheck,
    borrowerCheck: borrowerCheckData?.branches?.result?.[0]?.borrowerCheck,
  };

  // useOrderPageInformation is used to get userInfo and pickupBranchInfo
  const { userInfo, pickupBranchInfo } = useOrderPageInformation({
    workId: workId,
    periodicaForm: {},
    pids: pids,
  });

  // updateLoanerInfo (from userInfo) is used by handleOnSelect to change pickupBranch
  const { updateLoanerInfo } = userInfo;

  // pickupBranchUserAgencies (from pickupBranchInfo) is used by updateLoanerInfo in handleOnSelect to change pickupBranch
  const pickupBranchUserAgencies = pickupBranchInfo?.pickupBranchUser?.agencies;

  // Used by callbackUID and overrideOrderModalPush
  const orderModalProps = {
    pids: pids,
    selectedAccesses: allEnrichedAccesses,
    workId: workId,
    singleManifestation: singleManifestation,
  };

  // handleOnSelectEnriched enriches handleOnSelect with all its arguments:
  //   branch, modal, context, updateLoanerInfo, callbackUID, overrideOrderModalPush
  function handleOnSelectEnriched() {
    // callbackUID is used in handleOnSelect to add order to modal stack to return to order modal after adgangsplatformen
    const callbackUID = modal.saveToStore("order", {
      ...orderModalProps,
      storeLoanerInfo: true,
    });

    // overrideOrderModalPush is a callbackFunction used in handleOnSelect to open order modal,
    //   when previous modal was not order modal
    function overrideOrderModalPush() {
      openOrderModal({
        modal: modal,
        ...orderModalProps,
        storeLoanerInfo: false,
      });
    }

    // handleOnSelect sends user to one of 3 modals based on selected branch and loaner info:
    //  - User is logged on is on selected agency borrowerCheck -> Order modal
    //  - User not logged in and agency has borrowerCheck -> adgangsplatformen modal
    //  - User not logged in and agency does not have borrowerCheck -> loanerForm modal
    handleOnSelect(
      branch,
      modal,
      {
        ...context,
        initial: {
          agencies: pickupBranchUserAgencies,
        },
      },
      updateLoanerInfo,
      callbackUID,
      overrideOrderModalPush
    );
  }

  return {
    handleOnSelectEnriched: handleOnSelectEnriched,
    borrowerCheckIsLoading: borrowerCheckIsLoading,
  };
}

/**
 * @file
 * This file provides the hook useGoToOrderWithBranch that helps to go to Order modal with a given branch.
 */
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import uniq from "lodash/uniq";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";

import { handleOnSelect } from "@/components/_modal/utils";
import { useModal } from "@/components/_modal";
import { useOrderFlow } from "./order";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";

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
  orders,
  branchWithoutBorrowerCheck,
  workId,
}) {
  const modal = useModal();

  const selectedPids = orders?.map((order) => [...order?.pids]);
  const { access } = useManifestationAccess({ pids: selectedPids });
  // pids from allEnrichedAccesses is used to open Order modal
  const pids = uniq(access?.map((acc) => acc?.pids).flat());

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
  const { pickupBranchInfo, userInfo } = useOrderPageInformation({
    workId: workId,
    periodicaForm: {},
    pids: pids,
  });

  const { start } = useOrderFlow();

  // pickupBranchUserAgencies (from pickupBranchInfo) is used by updateLoanerInfo in handleOnSelect to change pickupBranch
  const pickupBranchUserAgencies = pickupBranchInfo?.pickupBranchUser?.agencies;

  // handleOnSelectEnriched enriches handleOnSelect with all its arguments:
  //   branch, modal, context, updateLoanerInfo, callbackUID, overrideOrderModalPush
  function handleOnSelectEnriched() {
    // handleOnSelect sends user to one of 3 modals based on selected branch and loaner info:
    //  - User is logged on is on selected agency borrowerCheck -> Order modal
    //  - User not logged in and agency has borrowerCheck -> adgangsplatformen modal
    //  - User not logged in and agency does not have borrowerCheck -> loanerForm modal
    handleOnSelect({
      branch: branch,
      modal: modal,
      context: {
        ...context,
        initial: {
          agencies: pickupBranchUserAgencies,
        },
      },
      orders: orders,
      start: start,
      updateLoanerInfo: userInfo.updateLoanerInfo,
      // we pass origin to differ between branchDetails and other uses
      // for now this hook is only used from branch details modal - that is a user
      // orders to a specific branch
      origin: "branchDetails",
    });
  }

  return {
    handleOnSelectEnriched: handleOnSelectEnriched,
    borrowerCheckIsLoading: borrowerCheckIsLoading,
  };
}

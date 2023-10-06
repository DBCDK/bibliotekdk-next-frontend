import { useGetManifestationsForOrderButton } from "@/components/hooks/useWorkAndSelectedPids";
import { useData } from "@/lib/api/api";
import * as branchesFragments from "@/lib/api/branches.fragments";
import { useMemo } from "react";
import { accessFactory } from "@/lib/accessFactoryUtils";
import uniq from "lodash/uniq";
import useOrderPageInformation from "@/components/hooks/useOrderPageInformations";
import Translate from "@/components/base/translate";

import { handleOnSelect } from "@/components/_modal/utils";
import { useModal } from "@/components/_modal";

export function useGoToOrderWithBranch({
  context,
  selectedPids,
  branchWithoutBorrowerCheck,
  workId,
}) {
  const modal = useModal();
  const { singleManifestation } = context;
  const { manifestations } = useGetManifestationsForOrderButton(
    workId,
    selectedPids
  );
  const branchId = branchWithoutBorrowerCheck?.branchId;

  const { data: borrowerCheckData, isLoading: borrowerCheckIsLoading } =
    useData(
      branchId && branchesFragments.borrowerCheck({ branchId: branchId })
    );

  const borrowerCheckBoolean =
    borrowerCheckData?.branches?.result?.[0]?.borrowerCheck;

  const branch = {
    ...branchWithoutBorrowerCheck,
    borrowerCheck: borrowerCheckBoolean,
  };

  const { allEnrichedAccesses } = useMemo(
    () => accessFactory(manifestations),
    [manifestations]
  );

  const pids = uniq(
    allEnrichedAccesses?.map((singleAccess) => singleAccess?.pid)
  );

  const { userInfo, pickupBranchInfo } = useOrderPageInformation({
    workId: workId,
    periodicaForm: {},
    pids: pids,
  });

  async function handleOnSelectEnriched() {
    const orderModalProps = {
      pids: pids,
      selectedAccesses: allEnrichedAccesses,
      workId: workId,
      singleManifestation: singleManifestation,
    };

    const uid = await modal.saveToStore("order", {
      ...orderModalProps,
      storeLoanerInfo: true,
    });

    const { updateLoanerInfo } = userInfo;

    const overrideOrderModalPush = () =>
      modal.push("order", {
        title: Translate({ context: "modal", label: "title-order" }),
        pids: pids,
        selectedAccesses: allEnrichedAccesses,
        workId: workId,
        ...(singleManifestation && { orderType: "singleManifestation" }),
        storeLoanerInfo: false,
      });

    handleOnSelect(
      branch,
      modal,
      {
        ...context,
        initial: {
          agencies: pickupBranchInfo?.pickupBranchUser?.agencies,
        },
      },
      updateLoanerInfo,
      uid,
      overrideOrderModalPush
    );
  }

  return {
    handleOnSelectEnriched: handleOnSelectEnriched,
    borrowerCheckIsLoading: borrowerCheckIsLoading,
  };
}

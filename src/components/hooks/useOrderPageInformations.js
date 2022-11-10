import usePickupBranch from "@/components/hooks/usePickupBranch";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import { inferAccessTypes } from "@/components/_modal/pages/edition/utils";
import { useMemo } from "react";

export default function useOrderPageInformation(workId, pid, periodicaForm) {
  const {
    authUser,
    loanerInfo,
    updateLoanerInfo,
    pickupBranch,
    isPickupBranchLoading,
    pickupBranchUser,
    isAuthenticatedForPickupBranch,
  } = usePickupBranch(pid);

  const workResponse = useData(
    workId && workFragments.orderPageManifestations({ workId })
  );

  const { data: workData, isLoading: isWorkLoading } = workResponse;

  const {
    isArticle,
    isPeriodicaLike,
    isArticleRequest,
    isDigitalCopy,
    availableAsDigitalCopy,
    isPhysical,
    availableAsPhysicalCopy,
    requireDigitalAccess,
  } = useMemo(() => {
    return inferAccessTypes(workData?.work, periodicaForm, pickupBranch);
  }, [workData?.work, periodicaForm, pickupBranch]);

  const isLoadingBranches =
    isWorkLoading ||
    isPickupBranchLoading ||
    (pickupBranchUser?.name && !pickupBranchUser?.agency);

  return {
    userInfo: {
      authUser,
      loanerInfo,
      updateLoanerInfo,
    },
    pickupBranchInfo: {
      pickupBranch: pickupBranch,
      isPickupBranchLoading: isPickupBranchLoading,
      pickupBranchUser,
      isAuthenticatedForPickupBranch,
      isLoadingBranches,
    },
    accessTypeInfo: {
      isArticle,
      isPeriodicaLike,
      isArticleRequest,
      isDigitalCopy,
      availableAsDigitalCopy,
      isPhysical,
      availableAsPhysicalCopy,
      requireDigitalAccess,
    },
    workResponse,
  };
}

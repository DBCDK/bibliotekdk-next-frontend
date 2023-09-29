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
    isLoading: userIsLoading,
    pickupBranchUser,
    isAuthenticatedForPickupBranch,
  } = usePickupBranch(pid);

  const workResponse = useData(
    workId && workFragments.orderPageWorkWithManifestations({ workId })
  );

  const { data: workData, isLoading: isWorkLoading } = workResponse;

  const {
    isArticle,
    isPeriodicaLike,
    isArticleRequest,
    isDigitalCopy,
    availableAsDigitalCopy,
    isPhysicalCopy,
    availableAsPhysicalCopy,
    requireDigitalAccess,
  } = useMemo(() => {
    return inferAccessTypes(
      periodicaForm,
      pickupBranch,
      workData?.work?.manifestations?.mostRelevant
    );
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
      userIsLoading,
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
      isPhysicalCopy,
      availableAsPhysicalCopy,
      requireDigitalAccess,
    },
    workResponse,
  };
}

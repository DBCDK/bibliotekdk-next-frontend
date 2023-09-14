import usePickupBranch from "@/components/hooks/user/usePickupBranch";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as branchesFragments from "@/lib/api/branches.fragments";
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

  const blockedUserResponse = useData(
    loanerInfo?.pickupBranch &&
      branchesFragments.checkBlockedUser({
        branchId: loanerInfo.pickupBranch,
      })
  );

  const { isLoading: isBlockedUserLoading } = blockedUserResponse;

  const isLoadingBranches =
    isWorkLoading ||
    isPickupBranchLoading ||
    isBlockedUserLoading ||
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
      isPhysicalCopy,
      availableAsPhysicalCopy,
      requireDigitalAccess,
    },
    blockedUserResponse,
    workResponse,
  };
}

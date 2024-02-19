import { useData } from "@/lib/api/api";
import { branchUserParameters } from "@/lib/api/branches.fragments";

/**
 *
 */
export function useBranchInfo({ branchId }) {
  const { data: userParams, isLoading } = useData(
    branchId &&
      branchUserParameters({
        branchId,
      })
  );

  const isBlocked =
    userParams?.branches?.result?.[0]?.borrowerCheck !== false &&
    !userParams?.branches?.borrowerStatus?.allowed;

  return {
    ...(userParams?.branches?.result?.[0] || {}),
    agencyUrl: userParams?.branches?.agencyUrl,
    branchId,
    isBlocked,
    borrowerStatus: userParams?.branches?.borrowerStatus,
    isLoading,
  };
}

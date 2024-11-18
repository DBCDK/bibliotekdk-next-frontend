import { useData } from "@/lib/api/api";
import { branchUserParameters } from "@/lib/api/branches.fragments";
import { shouldRequirePincode } from "./order";

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

  const branch = userParams?.branches?.result?.[0];

  // True if branch requires a pincode for borchk validation
  const pincodeRequired = shouldRequirePincode(branch);

  const isBlocked =
    !pincodeRequired &&
    branch?.borrowerCheck !== false &&
    !userParams?.branches?.borrowerStatus?.allowed;

  return {
    ...(branch || {}),
    agencyUrl: userParams?.branches?.agencyUrl,
    branchId,
    isBlocked,
    borrowerStatus: userParams?.branches?.borrowerStatus,
    pincodeRequired,
    isLoading,
  };
}

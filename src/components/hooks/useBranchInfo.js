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

  // @TODO if agency is ffu .. and borrowerstatus is UNKNOWN_USER .. we simple need the pincode - no block please
  const isBlocked = () => {
    if (
      userParams?.branches?.borrowerStatus?.statusCode === "UNKNOWN_USER" &&
      userParams?.branches?.result?.[0]?.agencyType === "FORSKNINGSBIBLIOTEK"
    ) {
      return false;
    } else {
      return (
        userParams?.branches?.result?.[0]?.borrowerCheck !== false &&
        !userParams?.branches?.borrowerStatus?.allowed
      );
    }
  };

  return {
    ...(userParams?.branches?.result?.[0] || {}),
    agencyUrl: userParams?.branches?.agencyUrl,
    branchId,
    isBlocked: isBlocked(),
    borrowerStatus: userParams?.branches?.borrowerStatus,
    isLoading,
  };
}

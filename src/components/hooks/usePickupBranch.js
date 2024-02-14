import useUser from "@/components/hooks/useUser";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import * as branchesFragments from "@/lib/api/branches.fragments";
import merge from "lodash/merge";
import useAuthentication from "./user/useAuthentication";
import useLoanerInfo from "./user/useLoanerInfo";

/**
 * Find branch with the given branchId in the list of agencies.
 *
 */
function findBranchByBranchId(agencies, branchId) {
  if (!agencies || !branchId) {
    return null;
  }
  for (const agency of agencies) {
    const brances = agency.result || [];

    for (const branch of brances) {
      if (branch.branchId === branchId) {
        return branch;
      }
    }
  }

  return null; // If no item is found
}

export default function usePickupBranch({ pids }) {
  const { isLoading: userIsLoading } = useUser();
  const { loanerInfo, updateLoanerInfo } = useLoanerInfo();
  const {
    isAuthenticated,
    isGuestUser,
    isLoading: authIsLoading,
    hasCulrUniqueId,
  } = useAuthentication();

  const isLoading = userIsLoading || authIsLoading;

  const hasPids = !!pids?.filter((pid) => !!pid).length > 0;
  /**
   * Branches, details, policies, and userParams
   */
  // Fetch branches and order policies for (loggedIn) user
  const { data: orderPolicy, isLoading: policyIsLoading } = useData(
    hasPids && loanerInfo.name && userFragments.orderPolicy({ pids: pids })
  );

  //Municipality main library
  const municipalityMainAgency = null;
  findBranchByBranchId(
    orderPolicy?.user?.agencies,
    loanerInfo?.municipalityAgencyId
  );

  //If user is not borrower in the municipality agency, we find the first main library in agencies list
  const mainLibraryOfFirstAgency = findBranchByBranchId(
    orderPolicy?.user?.agencies,
    orderPolicy?.user?.agencies[0]?.result[0]?.agencyId
  );
  // select first branch from user branches as default pickup branch
  const defaultUserPickupBranch =
    municipalityMainAgency || mainLibraryOfFirstAgency;

  // fetch user parameters for the selected pickup
  // OBS! Pickup can differ from users own branches.
  const { data: userParams, isLoading: userParamsIsLoading } = useData(
    loanerInfo?.pickupBranch &&
      branchesFragments.branchUserParameters({
        branchId: loanerInfo.pickupBranch,
      })
  );
  console.log("pickupbranch,loanerInfo,", loanerInfo);

  // scope
  const selectedBranch = userParams?.branches?.result?.[0];

  // Fetch order policies for selected pickupBranch (if pickupBranch differs from user agency branches)
  // check if orderPolicy already exist for selected pickupBranch
  const shouldFetchOrderPolicy =
    hasPids && selectedBranch?.branchId && !selectedBranch?.orderPolicy;

  // Fetch orderPolicy for selected branch, if not already exist
  const { data: selectedBranchPolicyData, isLoading: branchPolicyIsLoading } =
    useData(
      shouldFetchOrderPolicy &&
        branchesFragments.branchOrderPolicy({
          branchId: selectedBranch?.branchId,
          pids: pids,
        })
    );

  const { data: extendedUserData, isLoading: isLoadingExtendedData } = useData(
    hasCulrUniqueId && userFragments.extendedData()
  );

  const { data: borrowerStatus, isLoading: isLoadingBorrowerStatus } = useData(
    hasCulrUniqueId && userFragments.borrowerStatus()
  );

  //extendedUserData.user.lastUsedPickUpBranch is a branch Id. We find data for that branch from the orderPolicy list that we fetched earlier.
  const lastUsedPickUpBranch = findBranchByBranchId(
    orderPolicy?.user?.agencies,
    extendedUserData?.user?.lastUsedPickUpBranch
  );

  // scope
  const pickupBranchOrderPolicy =
    selectedBranchPolicyData?.branches?.result?.[0];

  // If found, merge fetched orderPolicy into pickupBranch
  const mergedSelectedBranch =
    pickupBranchOrderPolicy &&
    merge({}, selectedBranch, pickupBranchOrderPolicy);

  console.log("pickupbranch.defaultUserPickupBranch", defaultUserPickupBranch);
  console.log("pickupbranch.selectedBranch", selectedBranch);

  //fetch pickup branch
  const initialPickupBranch = {
    pickupBranch:
      mergedSelectedBranch ||
      lastUsedPickUpBranch ||
      selectedBranch ||
      defaultUserPickupBranch ||
      null,
  };

  // Merge user and branches
  const mergedUser = merge({}, loanerInfo, orderPolicy?.user); //TODO remove oderPolicy?.user ? seems to be empty but check all usecases

  const isPickupBranchLoading =
    policyIsLoading ||
    userParamsIsLoading ||
    branchPolicyIsLoading ||
    isLoadingExtendedData ||
    isLoadingBorrowerStatus;

  const pickupBranchUser = (!userParamsIsLoading && mergedUser) || {};
  const isAuthenticatedForPickupBranch = isAuthenticated || isGuestUser;

  return {
    authUser: loanerInfo,
    loanerInfo,
    isLoading,
    updateLoanerInfo,
    pickupBranch: initialPickupBranch.pickupBranch,
    isPickupBranchLoading,
    pickupBranchUser,
    isAuthenticatedForPickupBranch,
    borrowerStatus: borrowerStatus?.user?.agencies?.[0]?.borrowerStatus,
  };
}

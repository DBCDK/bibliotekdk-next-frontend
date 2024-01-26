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
  if (!agencies || !branchid) {
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

  // select first branch from user branches as default pickup branch
  const defaultUserPickupBranch = orderPolicy?.user?.agencies[0]?.result[0];
  // fetch user parameters for the selected pickup
  // OBS! Pickup can differ from users own branches.
  const { data: userParams, isLoading: userParamsIsLoading } = useData(
    loanerInfo?.pickupBranch &&
      branchesFragments.branchUserParameters({
        branchId: loanerInfo.pickupBranch,
      })
  );

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

  //extendedUserData returns a branch id. We find branch data for that branch from the orderPolicy list that we fetched earlier.
  const lastUsedPickUpBranch = findBranchByBranchId(
    orderPolicy?.user?.agencies,
    extendedUserData.user.lastUsedPickUpBranch
  );

  // scope
  const pickupBranchOrderPolicy =
    selectedBranchPolicyData?.branches?.result?.[0];

  // If found, merge fetched orderPolicy into pickupBranch
  const mergedSelectedBranch =
    pickupBranchOrderPolicy &&
    merge({}, selectedBranch, pickupBranchOrderPolicy);

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
    isLoadingExtendedData;

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
  };
}

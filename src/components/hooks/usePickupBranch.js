import useUser from "@/components/hooks/useUser";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import * as branchesFragments from "@/lib/api/branches.fragments";
import merge from "lodash/merge";
import useAuthentication from "./user/useAuthentication";
import useLoanerInfo from "./user/useLoanerInfo";

export default function usePickupBranch({ pids }) {
  const { isLoading: userIsLoading } = useUser();
  const { loanerInfo, updateLoanerInfo } = useLoanerInfo();
  const {
    isAuthenticated,
    isGuestUser,
    isLoading: authIsLoading,
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

  // scope
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

  // scope
  const pickupBranchOrderPolicy =
    selectedBranchPolicyData?.branches?.result?.[0];

  // If found, merge fetched orderPolicy into pickupBranch
  const mergedSelectedBranch =
    pickupBranchOrderPolicy &&
    merge({}, selectedBranch, pickupBranchOrderPolicy);

  const initialPickupBranch = {
    pickupBranch:
      mergedSelectedBranch || selectedBranch || defaultUserPickupBranch || null,
  };

  // Merge user and branches
  const mergedUser = merge({}, loanerInfo, orderPolicy?.user);

  const isPickupBranchLoading =
    policyIsLoading || userParamsIsLoading || branchPolicyIsLoading;
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

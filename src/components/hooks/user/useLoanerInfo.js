import { useData, useMutate } from "@/lib/api/api";
import * as sessionFragments from "@/lib/api/session.fragments";
import useAuthentication from "./useAuthentication";
import * as userFragments from "@/lib/api/user.fragments";
import { useMemo } from "react";
import merge from "lodash/merge";
import useLoans from "@/components/hooks/user/useLoans";
import { userDebts, userOrders } from "@/lib/api/user.fragments";
import useDebts from "@/components/hooks/user/useDebts";
import useOrders from "@/components/hooks/user/useOrders";

/**
 * Custom hook for retrieving loaner info from FBI-API.
 * Combines user and session data into a single result object.
 */
export default function useLoanerInfo() {
  const { isAuthenticated } = useAuthentication();

  // Used for sending mutate requests to FBI-API
  const mutateFbiApi = useMutate();

  // Fetch user data from fbi-api
  //const userRes = useData(isAuthenticated && userFragments.basic());
  const userRes = useData(isAuthenticated && userFragments.userBasic());

  const userLoans = useLoans();
  const userOrders = useOrders();
  const userDebts = useDebts();

  // Fetch session data stored in fbi-api
  const sessionRes = useData(sessionFragments.session());

  // We use useMemo to create result object, ensuring it's recalculated
  // only when data changes. This optimization may prevent unnecessary
  // re-renders throughout the application
  return useMemo(() => {
    const user = userRes?.data?.user;
    const session = sessionRes?.data?.session;

    // Extract relevant user parameters (needed for making orders).
    const userParameters = {
      userName: user?.name,
      userMail: user?.mail,
    };
    // Merge user parameters from the session data.
    Object.entries(session?.userParameters || {}).forEach(
      // do not overwrite with empty values
      ([key, val]) => {
        if (val) {
          userParameters[key] = val;
        }
      }
    );

    // Remove user parameters with no value
    Object.entries(userParameters).forEach(([key, val]) => {
      if (!val) {
        delete userParameters[key];
      }
    });

    return {
      loanerInfo: userRes && {
        agencies: user?.agencies,
        loans: userLoans,
        orders: userOrders,
        debt: userDebts,
        mail: user?.mail,
        municipalityAgencyId: user?.municipalityAgencyId,
        name: user?.name,
        address: user?.address,
        postalCode: userRes?.data?.user?.postalCode,
        rights: userRes?.data?.user?.rights,
        pickupBranch: session?.pickupBranch,
        allowSessionStorage: !!session?.allowSessionStorage,
        omittedCulrData: userRes?.data?.user?.omittedCulrData,
        userParameters,
      },
      isLoading: userRes?.isLoading || sessionRes?.isLoading,
      error: userRes?.error || sessionRes?.error,
      updateLoanerInfo: async (obj) => {
        const newSession = merge({}, session || {}, obj);
        // Update global loaner info object
        await mutateFbiApi.post(sessionFragments.submitSession(newSession));
        // Broadcast update
        await sessionRes?.mutate();
      },
    };
  }, [userRes, sessionRes, userDebts, userOrders, userLoans]);
}

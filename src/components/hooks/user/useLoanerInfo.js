import { useData, useMutate } from "@/lib/api/api";
import * as sessionFragments from "@/lib/api/session.fragments";
import { useAuthentication } from "./useAuthentication";
import * as userFragments from "@/lib/api/user.fragments";
import { useMemo } from "react";
import merge from "lodash/merge";

/**
 * Custom hook for retrieving loaner info from FBI-API.
 * Combines user and session data into a single result object.
 * Returns null if the user is not authenticated and not a guest user.
 */
export function useLoanerInfo() {
  const { isAuthenticated } = useAuthentication();

  // Used for sending mutate requests to FBI-API
  const mutateFbiApi = useMutate();

  // Fetch user data from fbi-api
  const user = useData(isAuthenticated && userFragments.basic());

  // Fetch session data stored in fbi-api
  const session = useData(sessionFragments.session());

  // We use useMemo to create result object, ensuring it's recalculated
  // only when data changes. This optimization may prevent unnecessary
  // re-renders throughout the application
  return useMemo(() => {
    // Extract relevant user parameters (needed for making orders).
    const userParameters = {
      userName: user?.data?.user?.name,
      userMail: user?.data?.user?.mail,
    };

    // Merge user parameters from the session data.
    Object.entries(session?.data?.session?.userParameters || {}).forEach(
      ([key, val]) => (userParameters[key] = val)
    );

    // Remove user parameters with no value
    Object.entries(userParameters).forEach(([key, val]) => {
      if (!val) {
        delete userParameters[key];
      }
    });

    return {
      loanerInfo: {
        ...user?.data?.user,
        ...session?.data?.session,
        userParameters,
      },
      isLoading: user?.isLoading || session?.isLoading,
      error: user?.error || session?.error,
      updateLoanerInfo: async (obj) => {
        const newSession = merge({}, session?.data?.session || {}, obj);
        // Update global loaner info object
        await mutateFbiApi.post(sessionFragments.submitSession(newSession));
        // Broadcast update
        await session?.mutate();
      },
    };
  }, [user, session, mutateFbiApi]);
}

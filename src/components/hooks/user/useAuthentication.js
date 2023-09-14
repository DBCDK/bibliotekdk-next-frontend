import { useData, useMutate } from "@/lib/api/api";
import { useSession } from "next-auth/react";
import * as sessionFragments from "@/lib/api/session.fragments";
import { useMemo } from "react";

/**
 * Custom React hook for getting authentication state.
 */
export function useAuthentication() {
  // Get the authenticated session using next-auth.
  const { data: authenticatedSession } = useSession();

  // Fetch session data stored in fbi-api (it may contain guest user data)
  const {
    data: guestSession,
    isLoading,
    mutate: guestSessionMutate,
  } = useData(sessionFragments.session());

  // Used for sending mutate requests to FBI-API
  const mutateFbiApi = useMutate();

  // Check if the user is authenticated based on the presence of a uniqueId.
  const isAuthenticated = !!authenticatedSession?.user?.uniqueId;

  // Check if fbi-api session contains user parameters
  const isGuestUser =
    !isAuthenticated &&
    Object.keys(guestSession?.session?.userParameters || {}).length > 0;

  // We use useMemo to create result object, ensuring it's recalculated
  // only when data changes. This optimization may prevent unnecessary
  // re-renders throughout the application
  return useMemo(() => {
    return {
      isAuthenticated,
      isGuestUser,
      isLoggedIn: isAuthenticated || isGuestUser,
      isLoading,
      guestLogout: async () => {
        // Delete global loaner info object
        await mutateFbiApi.post(sessionFragments.deleteSession());
        // Broadcast update
        await guestSessionMutate();
      },
    };
  }, [isAuthenticated, isGuestUser, isLoading]);
}

import { useData } from "@/lib/api/api";
import { useSession } from "next-auth/react";
import { authentication as authenticationFragment } from "@/lib/api/authentication.fragments";

/**
 * Custom React hook for getting authentication state.
 */
export default function useAuthentication() {
  // Get the authenticated session using next-auth.
  const { data: authenticatedSession } = useSession();

  // Fetch authentication data stored in fbi-api
  const { data, isLoading } = useData(authenticationFragment());

  // Check if the user is authenticated based on the presence of a uniqueId.
  const isAuthenticated = !!authenticatedSession?.user?.userId;

  // user exists in CULR (CULR users can both include 'folk' and cpr-verified 'ffu' users)
  const hasCulrUniqueId = !!data?.user?.hasCulrUniqueId;

  // User has a CPR verified account in culr
  const isCPRValidated = data?.user?.isCPRValidated;

  // The agency that the user used for logging in
  const loggedInAgencyId = data?.user?.loggedInAgencyId;

  // The agency that the user used for logging in
  const loggedInBranchId = data?.user?.loggedInBranchId;

  // Check if fbi-api session contains user parameters
  const isGuestUser =
    !isAuthenticated &&
    Object.keys(data?.session?.userParameters || {}).length > 0;

  const identityProviderUsed = data?.user?.identityProviderUsed;

  return {
    isAuthenticated,
    hasCulrUniqueId,
    isGuestUser,
    isCPRValidated,
    loggedInAgencyId,
    loggedInBranchId,
    identityProviderUsed,
    isLoading,
  };
}

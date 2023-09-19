import { useSession } from "next-auth/react";

/**
 * Custom React hook for getting FBI-API access token
 */
export function useAccessToken() {
  const { data } = useSession();

  return data?.accessToken;
}

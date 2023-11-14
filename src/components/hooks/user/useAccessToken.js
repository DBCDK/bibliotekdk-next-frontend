const { useSession } = require("next-auth/react");

/**
 * Custom hook for getting access token
 */
export default function useAccessToken() {
  const { data: session } = useSession();

  return session?.accessToken;
}

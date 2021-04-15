import { useSession } from "next-auth/client";

/**
 * Mock used in storybook
 */
function useUserMock() {
  return { isAuthenticated: false, accessToken: "dummy-token" };
}

/**
 * Hook for getting authenticated user
 */
function useUser() {
  const [session] = useSession();
  const accessToken = session?.accessToken;
  // TODO fetch user data when API supports it

  return { isAuthenticated: !!session?.user?.uniqueId, accessToken };
}

export default process.env.STORYBOOK_ACTIVE ? useUserMock : useUser;

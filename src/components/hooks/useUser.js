import { useSession } from "next-auth/client";

/**
 * Hook for getting authenticated user
 */
export default function useUser() {
  const [session] = useSession();
  // TODO fetch user data when API supports it

  return { isAuthenticated: !!session?.user?.uniqueId };
}

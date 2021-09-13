import { useSession } from "next-auth/client";
import useSWR, { mutate } from "swr";

/**
 * Mock used in storybook
 */
function useUserMock() {
  return { isAuthenticated: false, accessToken: "dummy-token" };
}

// in memory object for storing loaner info for current user
let loanerInfo = {};
const loanerInfoKey = "loanerinfo";

/**
 * Hook for getting and storing loaner info
 */
export function useLoanerInfo() {
  // Fetch loaner info
  // Note that this is not fetching from API, but local in-memory object
  const { data } = useSWR(loanerInfoKey, () => loanerInfo, {
    initialData: loanerInfo,
  });

  return {
    loanerInfo: data,
    updateLoanerInfo: (obj) => {
      // Update global loaner info object
      loanerInfo = { ...loanerInfo, ...obj };

      // Broadcast update
      mutate(loanerInfoKey);
    },
  };
}

/**
 * Hook for getting authenticated user
 */
function useUser() {
  const [session] = useSession();
  const accessToken = session?.accessToken;

  return {
    isAuthenticated: !!session?.user?.uniqueId,
    accessToken,
  };
}

export default process.env.STORYBOOK_ACTIVE ? useUserMock : useUser;

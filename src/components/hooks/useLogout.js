import { signOut } from "@dbcdk/login-nextjs/client";
import useSearchHistory from "./useSearchHistory";

/**
 * Centralized logout hook.
 * Clears advanced search history before signing the user out.
 */
const useLogout = () => {
  const { clearValues } = useSearchHistory();

  const logout = (redirectUrl) => {
    const url =
      redirectUrl ??
      (typeof window !== "undefined" ? window?.location?.origin : undefined);

    // Clear client-side search history
    clearValues();

    // Trigger sign out with the provided redirect URL
    signOut(url);
  };

  return { logout };
};

export default useLogout;



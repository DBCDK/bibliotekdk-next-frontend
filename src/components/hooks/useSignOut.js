import { useRouter } from "next/router";
import { useCallback } from "react";

const SIGNOUT_KEY = "isSigningOut";

/**
 * Custom hook to sign out the user via internal /logout page.
 * - Sets 'isSigningOut' flag in sessionStorage with timestamp
 * - Redirects to /logout?redirect_uri=...
 *
 * @returns {{ signOut: function, isSigningOut: boolean }}
 */
export default function useSignOut() {
  const router = useRouter();

  const signOut = useCallback(
    ({ redirectPath = "/" } = {}) => {
      if (typeof window === "undefined") return;

      // Set logout flag with timestamp
      sessionStorage.setItem(SIGNOUT_KEY, JSON.stringify({ ts: Date.now() }));

      const redirectUri = `${window.location.origin}${redirectPath}`;
      router.push(`/logout?redirect_uri=${encodeURIComponent(redirectUri)}`);
    },
    [router]
  );

  const isSigningOut = (() => {
    if (typeof window === "undefined") return false;
    const raw = sessionStorage.getItem(SIGNOUT_KEY);
    if (!raw) return false;

    try {
      const { ts } = JSON.parse(raw);
      // Optional display flag if within 15s window
      return Date.now() - ts < 15000;
    } catch {
      return false;
    }
  })();

  return { signOut, isSigningOut };
}

export { SIGNOUT_KEY };

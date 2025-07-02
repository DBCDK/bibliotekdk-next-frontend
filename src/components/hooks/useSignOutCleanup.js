import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { mutate as mutateSWR } from "swr";
import { authentication as authenticationFragment } from "@/lib/api/authentication.fragments";
import { useKeyGenerator } from "@/lib/api/api";

const SIGNOUT_KEY = "isSigningOut";
const SIGNOUT_MAX_AGE_MS = 10000; // 10 sekunder

/**
 * Hook that resets session state after Adgangsplatformen logout.
 * - Clears NextAuth session
 * - Revalidates useSession()
 * - Revalidates useAuthentication() (GraphQL auth data)
 * - Removes stale logout flags (fallback cleanup)
 * - Cleans ?message=logout from URL
 *
 * @returns {{ wasSigningOut: boolean }}
 */
export default function useSignOutCleanup() {
  const router = useRouter();
  const keyGenerator = useKeyGenerator();
  const [wasSigningOut, setWasSigningOut] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const isLogoutMessage = router.query?.message === "logout";
    const raw = sessionStorage.getItem(SIGNOUT_KEY);
    if (!raw) return;

    let shouldCleanup = false;

    try {
      const { ts } = JSON.parse(raw);
      const age = Date.now() - ts;
      if (age < SIGNOUT_MAX_AGE_MS && isLogoutMessage) {
        shouldCleanup = true;
      } else {
        sessionStorage.removeItem(SIGNOUT_KEY); // stale eller irrelevant
      }
    } catch {
      sessionStorage.removeItem(SIGNOUT_KEY); // malformed
    }

    if (!shouldCleanup) return;

    async function cleanup() {
      try {
        // Fjern NextAuth-sessionen
        await signOut({ redirect: false });

        // Revalidate FBI-auth-data (GraphQL)
        const authKey = keyGenerator(authenticationFragment());
        await mutateSWR(authKey);

        // Revalidate useSession
        await mutateSWR("/api/auth/session");
      } finally {
        sessionStorage.removeItem(SIGNOUT_KEY);
        setWasSigningOut(true);

        // Fjern message=logout fra URL
        const { message, ...rest } = router.query;
        router.replace({ pathname: router.pathname, query: rest }, undefined, {
          shallow: true,
        });
      }
    }

    cleanup();
  }, [router, keyGenerator]);

  return { wasSigningOut };
}

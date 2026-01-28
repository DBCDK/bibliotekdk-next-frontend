import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useModal } from "@/components/_modal";
import Translate from "../base/translate";
import useAuthentication from "../hooks/user/useAuthentication";

const ERROR_MESSAGES = {
  no_url: {
    title: "hasfolk-missing-url-title",
    text: "hasfolk-missing-url-text",
  },
  not_logged_in: {
    title: "not-logged-in-title",
    text: "not-logged-in-text",
  },
  no_folk_library: {
    title: "nofolk-missing-url-title",
    text: "nofolk-missing-url-text",
  },
  has_folk_library: {
    title: "hasfolk-missing-url-title",
    text: "hasfolk-missing-url-text",
  },
};

function getFirstQueryValue(v) {
  return Array.isArray(v) ? v[0] : v;
}

export default function RedirectErrorListener() {
  const router = useRouter();
  const modal = useModal();

  const { isAuthenticated, isFolkUser, isLoading } = useAuthentication();

  const redirectError = useMemo(() => {
    const raw0 = getFirstQueryValue(router.query?.redirect_error);
    if (!raw0) return null;

    let raw = raw0;

    // Wait for auth state before resolving unknown
    if (raw === "unknown") {
      if (isLoading) return null;

      if (!isAuthenticated) {
        raw = "not_logged_in";
      } else {
        raw = isFolkUser ? "has_folk_library" : "no_folk_library";
      }
    }

    return ERROR_MESSAGES[raw] ? raw : null;
  }, [router.query?.redirect_error, isAuthenticated, isFolkUser, isLoading]);

  useEffect(() => {
    if (!redirectError) return;
    if (isLoading) return;

    // Avoid double-open if modal already shown
    if (modal.index("statusMessage") >= 0) return;

    const info = ERROR_MESSAGES[redirectError];

    setTimeout(() => {
      modal.push("statusMessage", {
        title: Translate({
          context: "publizon",
          label: info?.title,
        }),
        text: Translate({
          context: "publizon",
          label: info?.text,
          renderAsHtml: true,
        }),
      });

      // we delay this modal to show last (if other modals are initialized)
    }, 1000);
  }, [isLoading, redirectError]);

  // update query params when modal closes
  useEffect(() => {
    if (!router.isReady) return;

    if (!modal.isVisible && modal.hasBeenVisible) {
      // Remove redirect_error from URL so it won't trigger again
      const nextQuery = { ...router.query };
      delete nextQuery.redirect_error;
      router.replace(
        { pathname: router.pathname, query: nextQuery },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [router.isReady, modal.isVisible]);

  return null;
}

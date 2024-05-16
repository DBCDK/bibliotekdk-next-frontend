import { useEffect, useMemo, useState } from "react";
import getConfig from "next/config";
const config = getConfig();
const useFixedSessionId = config?.publicRuntimeConfig?.useFixedSessionId;

const isClient = typeof window !== "undefined";

export default function useCookieConsent() {
  // eslint-disable-next-line no-unused-vars
  const [_, forceRender] = useState();

  // The cookiebot script is downloaded and executed before any NextJS stuff
  // hence Cookiebot should be available on first render
  const consent = isClient ? window.Cookiebot?.consent : null;

  // Extract matomo visitor id from cookie
  // It only exists of user has given statistics consent
  const uniqueVisitorId = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    if (consent?.statistics) {
      if (useFixedSessionId) {
        return "test";
      }
      const cookies = document.cookie.split("; ");
      return (
        cookies
          .find((cookie) => cookie.startsWith("_pk_id"))
          ?.split("=")?.[1]
          ?.split(".")?.[0] || ""
      );
    }
    return "";
  }, [consent?.statistics]);

  useEffect(() => {
    function update() {
      forceRender({});
    }
    window.addEventListener("CookiebotOnAccept", update);
    window.addEventListener("CookiebotOnDecline", update);
    return () => {
      window.removeEventListener("CookiebotOnAccept", update);
      window.removeEventListener("CookiebotOnDecline", update);
    };
  }, []);

  return {
    necessary: true,
    preferences: consent?.preferences || false,
    statistics: consent?.statistics || false,
    marketing: consent?.marketing || false,
    uniqueVisitorId,
  };
}

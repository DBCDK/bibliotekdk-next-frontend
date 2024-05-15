import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import getConfig from "next/config";
const config = getConfig();
const useFixedSessionId = config?.publicRuntimeConfig?.useFixedSessionId;

const UNIQUE_VISITOR_KEY = "uniqueVisitorId";
const isClient = typeof window !== "undefined";

// This uniqueVisitorId is completely anonymous
// And therefore can be safely sent to FBI-API
let uniqueVisitorId = isClient ? getLocalStorageItem(UNIQUE_VISITOR_KEY) : null;

export default function useCookieConsent() {
  // eslint-disable-next-line no-unused-vars
  const [_, forceRender] = useState();

  // The cookiebot script is downloaded and executed before any NextJS stuff
  // hence Cookiebot should be available on first render
  const consent = isClient ? window.Cookiebot?.consent : null;

  // Create id, if it does not exist
  if (!uniqueVisitorId && isClient) {
    uniqueVisitorId =
      uuidv4() + "_" + (consent?.statistics ? "CONSENT" : "NOCONSENT");
    setLocalStorageItem(UNIQUE_VISITOR_KEY, uniqueVisitorId);
  }

  useEffect(() => {
    // Check if we need to create new unique visitor id
    // If user withdraws or gievs consent, we need a new ID
    if (
      (consent?.statistics && !uniqueVisitorId?.includes("_CONSENT")) ||
      (!consent?.statistics && !uniqueVisitorId?.includes("_NOCONSENT"))
    ) {
      uniqueVisitorId = null;
      forceRender({});
    }
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
    uniqueVisitorId: useFixedSessionId
      ? "test"
      : uniqueVisitorId?.split("_")?.[0],
  };
}

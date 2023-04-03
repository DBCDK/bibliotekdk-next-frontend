import { useEffect, useState } from "react";

export default function useCookieConsent() {
  // eslint-disable-next-line no-unused-vars
  const [_, forceRender] = useState();

  // The cookiebot script is downloaded and executed before any NextJS stuff
  // hence Cookiebot should be available on first render
  const consent =
    typeof window !== "undefined" ? window.Cookiebot?.consent : null;

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
  };
}

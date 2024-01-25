import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Matomo() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // The document title is not updated when
      // routeChangeComplete occurs..
      // Got to add delay until its fixed in nextjs
      setTimeout(() => {
        window._paq.push(["setReferrerUrl", url]);
        window._paq.push(["setCustomUrl", url]);
        window._paq.push(["setDocumentTitle", document.title]);
        window._paq.push(["trackPageView"]);
        window._paq.push(["enableLinkTracking"]);
      }, 500);
    };

    // Subscribe to route change events
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      <Script
        id="MatomoConnect"
        type="text/javascript"
        src="/matomo-connect.js"
      />
      <Script
        id="MatomoScript"
        type="text/javascript"
        src="/matomo-script.js"
      />
    </>
  );
}

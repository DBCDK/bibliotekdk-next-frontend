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
        _paq.push(["setCustomUrl", url]);
        _paq.push(["setDocumentTitle", document.title]);
        _paq.push(["trackPageView"]);
      }, 500);
    };

    // Subscribe to route change events
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return null;
}

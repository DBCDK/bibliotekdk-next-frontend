import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Matomo({ allowCookies = false }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // The document title is not updated when
      // routeChangeComplete occurs..
      // Got to add delay until its fixed in nextjs
      setTimeout(() => {
        window._paq.push(["setCustomUrl", url]);
        window._paq.push(["setDocumentTitle", document.title]);
        if (!allowCookies) {
          window._paq.push(["disableCookies"]);
        }
        window._paq.push(["trackPageView"]);
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
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `var _paq = window._paq || [];
              ${allowCookies ? "" : '_paq.push(["disableCookies"]);'}
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u = 'https://stats.dbc.dk/';
                _paq.push(['setTrackerUrl', u + 'piwik.php']);
                _paq.push(['setSiteId', '33']);
                var d = document,
                  g = d.createElement('script'),
                  s = d.getElementsByTagName('script')[0];
                g.type = 'text/javascript';
                g.async = true;
                g.defer = true;
                g.src = u + 'piwik.js';
                s.parentNode.insertBefore(g, s);
              })();`,
        }}
      />
    </Head>
  );
}

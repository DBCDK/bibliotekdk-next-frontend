import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// function globalMatomoTracker() {
//   return `var waitForTrackerCount = 0;
//     function matomoWaitForTracker() {
//       if (typeof _paq === 'undefined' || typeof Cookiebot === 'undefined') {
//         if (waitForTrackerCount < 40) {
//           setTimeout(matomoWaitForTracker, 250);
//           waitForTrackerCount++;
//           return;
//         }
//       } else {
//         window.addEventListener('CookiebotOnAccept', function (e) {
//             consentSet();
//         });
//         window.addEventListener('CookiebotOnDecline', function (e) {
//             consentSet();
//         })
//       }
//     }
//     function consentSet() {
//       if (Cookiebot.consent.statistics) {
//         _paq.push(['setCookieConsentGiven']);
//         _paq.push(['setConsentGiven']);
//       } else {
//         _paq.push(['forgetCookieConsentGiven']);
//         _paq.push(['forgetConsentGiven']);
//       }
//     }
//     document.addEventListener('DOMContentLoaded', matomoWaitForTracker());`;
// }
//
// function globalMatomoCookieConsenter(allowCookies) {
//   return `var _paq = window._paq || [];
//     ${allowCookies ? "" : '_paq.push(["disableCookies"]);'}
//     _paq.push(['trackPageView']);
//     _paq.push(['enableLinkTracking']);
//     (function() {
//       var u = 'https://stats.dbc.dk/';
//       _paq.push(['setTrackerUrl', u + 'piwik.php']);
//       _paq.push(['setSiteId', '33']);
//       var d = document,
//         g = d.createElement('script'),
//         s = d.getElementsByTagName('script')[0];
//       g.type = 'text/javascript';
//       g.async = true;
//       g.defer = true;
//       g.src = u + 'piwik.js';
//       s.parentNode.insertBefore(g, s);
//     })();`;
// }
export default function Matomo({}) {
  useEffect(() => {
    console.log("window: ", window);
  }, []);

  // function NewNewMatomo({ allowCookies = false }) {
  // const router = useRouter();

  // function handleRouteChange2() {
  //   _paq.push(["setCustomUrl", "/" + window?.location?.hash?.slice(1)]);
  //   _paq.push(["setDocumentTitle", window?.location?.name]);
  //   _paq.push(["trackPageView"]);
  // }
  //   console.log("window: ", window);
  // window.addEventListener("hashchange", handleRouteChange2);
  //
  // return () => {
  //   window.removeEventListener("hashchange", handleRouteChange2);
  // };
  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     // The document title is not updated when
  //     // routeChangeComplete occurs..
  //     // Got to add delay until its fixed in nextjs
  //     setTimeout(() => {
  //       window._paq.push(["setCustomUrl", url]);
  //       window._paq.push(["setDocumentTitle", document.title]);
  //       // if (!allowCookies) {
  //       //   window._paq.push(["disableCookies"]);
  //       // }
  //       window._paq.push(["trackPageView"]);
  //     }, 500);
  //   };
  //
  //   console.log("window: ", window);
  //
  //   // Subscribe to route change events
  //   router.events.on("routeChangeComplete", handleRouteChange);
  //
  //   // If the component is unmounted, unsubscribe
  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, []);
  return (
    <>
      {/*<Script*/}
      {/*  id={"matomo_tracker"}*/}
      {/*  dangerouslySetInnerHTML={{ __html: matomoTracker }}*/}
      {/*/>*/}
      {/*<Script*/}
      {/*  id={"matomo_cookie_consenter"}*/}
      {/*  dangerouslySetInnerHTML={{ __html: matomoCookieConsenter }}*/}
      {/*/>*/}
      <Script
        src="/matomo_tracker.js"
        id="matomo_tracker"
        type="text/javascript"
      ></Script>
      <Script
        src="/matomo_cookie_consenter.js"
        id="matomo_cookie_consenter"
        type="text/javascript"
      ></Script>
      {/*<Script*/}
      {/*  src="/matomo_self_made.js"*/}
      {/*  id="matomo_self_made"*/}
      {/*  type="text/javascript"*/}
      {/*></Script>*/}
    </>
  );
}

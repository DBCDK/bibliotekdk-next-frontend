// var _paq = window._paq || [];
// var allowCookies = document.currentScript.getAttribute("data-allow-cookies");
// var allowCookies = window?.CookieConsent?.consented;
// var allowCookies = window?.CookieBot?.consent?.statistics;

// var _paq = (window._paq = window._paq || []);
// _paq.push(["requireCookieConsent"]);
// ---------------- TESTA
// _paq.push(["requireConsent"]);
// console.log("AllowCookies: ", allowCookies);
// // console.log(
// //   "allowCookies from props: ",
// //   document.currentScript.getAttribute("data-allow-cookies")
// // );
// // if (allowCookies) {
// // } else {
// //   _paq.push(["disableCookies"]);
// // }
// _paq.push(["trackPageView"]);
// _paq.push(["enableLinkTracking"]);
// (function () {
//   var u = "https://stats.dbc.dk/";
//   _paq.push(["setTrackerUrl", u + "matomo.php"]);
//   _paq.push(["setSiteId", "33"]);
//   var d = document,
//     g = d.createElement("script"),
//     s = d.getElementsByTagName("script")[0];
//   g.type = "text/javascript";
//   g.async = true;
//   g.defer = true;
//   g.src = u + "matomo.js";
//   s.parentNode.insertBefore(g, s);
// })();
// ---------------- TESTA

var _paq = (window._paq = window._paq || []);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["requireCookieConsent"]);
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "https://stats.dbc.dk/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "33"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = u + "matomo.js";
  s.parentNode.insertBefore(g, s);
})();

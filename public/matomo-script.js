// Clean up cookie that may have been set due to misconfiguration
// (We are only using cookie consent)
document.cookie =
  "mtm_consent_removed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

var _paq = (window._paq = window._paq || []);

_paq.push(["requireCookieConsent"]);
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);
(function () {
  var u = "https://stats.dbc.dk/";
  _paq.push(["setTrackerUrl", u + "matomo.php"]);
  _paq.push(["setSiteId", "45"]);
  var d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.async = true;
  g.src = u + "matomo.js";
  s.parentNode.insertBefore(g, s);
})();

/* Extract data */
var cbid = document.currentScript.getAttribute("data-cbid") || null;
var matomoId = document.currentScript.getAttribute("data-matomo-id") || null;

if (typeof cbid === "undefined" || cbid === null) {
  throw new Error(
    "cbid [cookiebot-id] is missing. Get the id from IT via Cookiebot CMP"
  );
}

if (typeof matomoId === "undefined" || matomoId === null) {
  throw new Error(
    "matomoId [Matomo-id] is missing. Get the id from Matomo in stats.dbc.dk"
  );
}

var _paq = (window._paq = window._paq || []);

/* Initialise cookiebot-consent-* */
_paq.push(["requireCookieConsent"]);
(function () {
  const u = "https://stats.dbc.dk/";
  _paq.push(["setTrackerUrl", u + "piwik.php"]);
  _paq.push(["setSiteId", matomoId]);
  const d = document,
    g = d.createElement("script"),
    s = d.getElementsByTagName("script")[0];
  g.type = "text/javascript";
  g.async = true;
  g.defer = true;
  g.src = u + "piwik.js";
  s.parentNode.insertBefore(g, s);
})();

function getCookieId(cookieName) {
  return "cookiebot-consent-" + cookieName + "=";
}

function getCookieString(cookieName, cookieValue) {
  return getCookieId(cookieName) + cookieValue + ";SameSite=Strict";
}

function extractCookiebotConsent(cookieName) {
  let cookieId = getCookieId(cookieName);

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(cookieId))
    ?.split("=");
}

function createOrExtractCookiebotConsent(cookieName) {
  const cookieValue = extractCookiebotConsent(cookieName);

  if (cookieValue) {
    return getCookieString(cookieName, cookieValue[1]);
  } else {
    return getCookieString(cookieName, "0");
  }
}

document.cookie = getCookieString("necessary", "1");
document.cookie = createOrExtractCookiebotConsent("statistics");
document.cookie = createOrExtractCookiebotConsent("preferences");
document.cookie = createOrExtractCookiebotConsent("marketing");

/* Cookiebot */
window.addEventListener("CookiebotOnConsentReady", function () {
  var C = Cookiebot.consent;
  var c = ["preferences", "statistics", "marketing"];
  function m(a) {
    var cookie_event = new CustomEvent("cookie_consent_" + a);
    dispatchEvent(cookie_event);
  }
  c.forEach(function (i) {
    const cookieValue = extractCookiebotConsent(i)[1];

    if (cookieValue && Number(cookieValue) !== Number(C[i])) {
      document.cookie = getCookieId(i) + Number(C[i]);
      m(i);
    }
  });
});

window.addEventListener("cookie_consent_statistics", function () {
  // var _paq = (window._paq = window._paq || []);
  var cookieValue = extractCookiebotConsent("statistics");

  if (cookieValue[1] === "1") {
    _paq.push(["setCookieConsentGiven"]);
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
  } else {
    _paq.push(["forgetCookieConsentGiven"]);
  }
});

!(function (C, oo, k, ie, b, o, t) {
  (b = C.createElement(oo)), (o = C.getElementsByTagName(oo)[0]);
  b.src = "https://consent.cookiebot.com/uc.js?cbid=" + ie;
  b.id = k;
  b.async = !0;
  o.parentNode.insertBefore(b, o);
})(document, "script", "Cookiebot", cbid);

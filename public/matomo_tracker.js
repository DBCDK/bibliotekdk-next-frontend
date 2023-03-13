var Cookiebot = window?.Cookiebot;
var CookieConsent = window?.CookieConsent;
var _paq = window?._paq;
// var _paq = window?._paq;

console.log("Cookiebot in tracker: ", Cookiebot);

var waitForTrackerCount = 0;
function matomoWaitForTracker() {
  if (typeof _paq === "undefined" || typeof Cookiebot === "undefined") {
    if (waitForTrackerCount < 40) {
      setTimeout(matomoWaitForTracker, 250);
      waitForTrackerCount++;
      console.log("Venter ... " + waitForTrackerCount);
      return;
    }
  } else {
    console.log("Klar!");
    window.addEventListener("CookiebotOnAccept", function (e) {
      console.log("CookiebotOnAccept!");
      consentSet();
    });
    window.addEventListener("CookiebotOnDecline", function (e) {
      console.log("CookiebotOnDecline!");
      consentSet();
    });
  }
}
function consentSet() {
  console.log("Cookiebot in ConsentSet(): ", Cookiebot);
  console.log("CookieConsent in ConsentSet(): ", CookieConsent);

  if (CookieConsent.consent.statistics) {
    console.log("Hej fra setCookie");
    _paq.push(["setCookieConsentGiven"]);
    _paq.push(["setConsentGiven"]);
  } else {
    console.log("Hej fra forgetCookie");
    _paq.push(["forgetCookieConsentGiven"]);
    _paq.push(["forgetConsentGiven"]);
  }
}
document.addEventListener("DOMContentLoaded", matomoWaitForTracker());

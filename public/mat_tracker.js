var waitForTrackerCount = 0;

function matomoWaitForTracker() {
  if (typeof _paq === "undefined" || typeof Cookiebot === "undefined") {
    if (waitForTrackerCount < 40) {
      setTimeout(matomoWaitForTracker, 250);
      waitForTrackerCount++;
      return;
    }
  } else {
    window.addEventListener("CookiebotOnAccept", function (e) {
      consentSet();
    });
    window.addEventListener("CookiebotOnDecline", function (e) {
      consentSet();
    });
  }
}

function consentSet() {
  if (Cookiebot.consented || Cookiebot.consent.statistics) {
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
    _paq.push(["setCookieConsentGiven"]);
  } else {
    _paq.push(["requireCookieConsent"]);
    _paq.push(["forgetCookieConsentGiven"]);
  }
}

document.addEventListener("DOMContentLoaded", matomoWaitForTracker());

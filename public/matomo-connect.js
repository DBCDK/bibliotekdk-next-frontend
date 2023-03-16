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
  if (Cookiebot.consented) {
    _paq.push(["setCookieConsentGiven"]);
    _paq.push(["setConsentGiven"]);
    _paq.push(["trackPageView"]);
  } else {
    _paq.push(["forgetCookieConsentGiven"]);
    _paq.push(["forgetConsentGiven"]);
  }
}

document.addEventListener("DOMContentLoaded", matomoWaitForTracker());

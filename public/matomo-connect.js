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
    consentSet();
  }
}

function consentSet() {
  if (Cookiebot.consent.statistics) {
    _paq.push(["setCookieConsentGiven"]);
  } else {
    _paq.push(["forgetCookieConsentGiven"]);
  }
}

document.addEventListener("DOMContentLoaded", matomoWaitForTracker());

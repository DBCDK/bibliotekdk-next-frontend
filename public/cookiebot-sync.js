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
      console.log("### CookiebotOnAccept");
      console.log("### Cookiebot", Cookiebot);
      Cookiebot.runScripts();
    });
    window.addEventListener("CookiebotOnDecline", function (e) {
      console.log("### CookiebotOnDecline");
      console.log("### Cookiebot", Cookiebot);
      Cookiebot.runScripts();
    });
  }
}

function CookiebotCallback_OnAccept() {
  Cookiebot.runScripts();
}

function CookiebotCallback_OnDecline() {
  Cookiebot.runScripts();
}

document.addEventListener("DOMContentLoaded", matomoWaitForTracker());

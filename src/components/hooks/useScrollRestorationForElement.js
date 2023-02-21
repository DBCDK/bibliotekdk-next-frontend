import { useEffect } from "react";

import Router from "next/router";

function baseUrl(url) {
  return url.split("?")?.[0];
}

function sessionStorageId(url, sliderId) {
  return `${url}___${sliderId}`;
}
function saveScrollPos(url, sliderId, parentRef) {
  const scrollPos = {
    x: parentRef?.current?.scrollLeft,
    y: parentRef?.current?.scrollTop,
  };
  sessionStorage.setItem(
    sessionStorageId(baseUrl(url), sliderId),
    JSON.stringify(scrollPos)
  );
}

function restoreScrollPos(url, sliderId, parentRef) {
  const scrollPos = JSON.parse(
    sessionStorage.getItem(sessionStorageId(baseUrl(url), sliderId))
  );
  if (scrollPos) {
    parentRef?.current?.scrollBy({
      left: scrollPos.x,
      top: scrollPos.y,
      behavior: "auto",
    });
  }
}
function useScrollRestorationForElementImpl(
  router,
  sliderId,
  parentRef,
  disableScrollRestoration = false
) {
  useEffect(() => {
    if (!disableScrollRestoration && "scrollRestoration" in window.history) {
      let shouldScrollRestore = false;
      window.history.scrollRestoration = "manual";
      restoreScrollPos(router.asPath, sliderId, parentRef);

      const onBeforeUnload = (event) => {
        saveScrollPos(router.asPath, sliderId, parentRef);
        delete event["returnValue"];
      };

      const onRouteChangeStart = () => {
        saveScrollPos(router.asPath, sliderId, parentRef);
      };

      const onRouteChangeComplete = (url) => {
        if (shouldScrollRestore) {
          shouldScrollRestore = false;
          restoreScrollPos(url, sliderId, parentRef);
        }
      };
      // pjo - cypress experiment
      if (!window.navigator.userAgent.includes("Cypress")) {
        window.addEventListener("beforeunload", onBeforeUnload);
      }
      Router.events.on("routeChangeStart", onRouteChangeStart);
      Router.events.on("routeChangeComplete", onRouteChangeComplete);
      Router.beforePopState(() => {
        shouldScrollRestore = true;
        return true;
      });

      return () => {
        // pjo - cypress experiment
        if (!window.navigator.userAgent.includes("Cypress")) {
          window.removeEventListener("beforeunload", onBeforeUnload);
        }
        Router.events.off("routeChangeStart", onRouteChangeStart);
        Router.events.off("routeChangeComplete", onRouteChangeComplete);
        Router.beforePopState(() => true);
      };
    }
  }, [router]);
}

const useScrollRestorationForElement = process.env.STORYBOOK_ACTIVE
  ? () => {}
  : useScrollRestorationForElementImpl;

export default useScrollRestorationForElement;

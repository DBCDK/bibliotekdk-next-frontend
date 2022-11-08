/**
 * @file
 * This is a custom app component.
 * We use it to override default behaviour.
 * See https://nextjs.org/docs/advanced-features/custom-app
 *
 * Specifically, we make sure pages are wrapped with the
 * APIStateContext.Provider, such that the data fetched
 * via getServerSideProps is used when the React app
 * is rendered.
 */
import React from "react";

import Cookies from "js-cookie";

import { SessionProvider } from "next-auth/react";
import smoothscroll from "smoothscroll-polyfill";

import { SWRConfig } from "swr";

import { destroy } from "@dbcdk/login-nextjs/client";

import Head from "next/head";

import "@/scss/custom-bootstrap.scss";
import "@/css/styles.css";

import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";

import { APIStateContext } from "@/lib/api/api";

import {
  setLocale,
  setTranslations,
} from "@/components/base/translate/Translate";

import Banner from "@/components/banner/Banner";
import Footer from "@/components/footer";
import Matomo from "@/components/matomo";
import BodyScrollLock from "@/components/scroll/lock";
import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import useScrollRestoration from "@/components/hooks/useScrollRestoration";
import CookieBox, { COOKIES_ALLOWED } from "@/components/cookiebox";
import Notifications from "@/components/base/notifications/Notifications";
import HelpHeader from "@/components/help/header";
import FeedBackLink from "@/components/feedbacklink";
import { SkipToMainLink } from "@/components/base/skiptomain/SkipToMain";
import { enableDataCollect } from "@/lib/useDataCollect";

import fetchTranslations from "@/lib/api/backend";
import App from "next/app";
import SetPickupBranch from "@/components/utils/SetPickupBranch";

// kick off the polyfill!
if (typeof window !== "undefined") {
  smoothscroll.polyfill();
}

export default function MyApp({ Component, pageProps, router }) {
  // If this is rendered on server, allowCookies will be in pageProps
  // In the browser, we use Cookies.get
  const allowCookies =
    typeof window === "undefined"
      ? pageProps.allowCookies
      : !!Cookies.get(COOKIES_ALLOWED);

  // Enable data collect, when cookies are approved
  enableDataCollect(allowCookies);

  setLocale(router.locale);
  // pass translations to Translate component - it might be false -
  // let Translate component handle whatever could be wrong with the result
  setTranslations(pageProps.translations);
  // Restore scrollPosition on page change (where page using getServersideProps)
  useScrollRestoration(router);

  // swr global confuguration options
  const swrConfigValue = {
    // catches all errors thrown in fetcher
    onError: async (err) => {
      switch (err.status) {
        case 403:
          // calls destroy to remove all session cookies
          destroy();
          break;
      }
    },
  };

  return (
    <SWRConfig value={swrConfigValue}>
      <SessionProvider
        session={
          router.query.disablePagePropsSession ? undefined : pageProps.session
        }
        options={{
          clientMaxAge: 60, // Re-fetch session if cache is older than 60 seconds
          keepAlive: 5 * 60, // Send keepAlive message every 5 minutes
        }}
      >
        <APIStateContext.Provider value={pageProps.initialData}>
          <Modal.Provider
            router={{
              pathname: router.pathname,
              query: router.query,
              push: (obj) => router.push(obj),
              replace: (obj) => router.replace(obj),
              go: (index) => window.history.go(index),
            }}
          >
            <Modal.Container>
              <Modal.Page id="menu" component={Pages.Menu} />
              <Modal.Page id="options" component={Pages.Options} />
              <Modal.Page id="order" component={Pages.Order} />
              <Modal.Page id="periodicaform" component={Pages.PeriodicaForm} />
              <Modal.Page id="pickup" component={Pages.Pickup} />
              <Modal.Page id="loanerform" component={Pages.Loanerform} />
              <Modal.Page id="receipt" component={Pages.Receipt} />
              <Modal.Page id="login" component={Pages.Login} />
              <Modal.Page id="filter" component={Pages.Filter} />
              <Modal.Page id="localizations" component={Pages.Localizations} />
              <Modal.Page id="references" component={Pages.References} />
            </Modal.Container>
            <Matomo allowCookies={allowCookies} />
            <BodyScrollLock router={router} />
            <div id="layout">
              <Head>
                <title />
                <meta name="mobile-web-app-capable" content="yes"></meta>
                <meta name="theme-color" content="#3333ff"></meta>
              </Head>
              <SkipToMainLink />
              <Banner />
              <Notifications />
              <HelpHeader />

              <Component {...pageProps} />
              <FeedBackLink />
              <CookieBox />
              <Footer />
            </div>
          </Modal.Provider>
        </APIStateContext.Provider>
        {/* SetPickupBranch listens for users just logged in via adgangsplatformen */}
        <SetPickupBranch router={router} />
      </SessionProvider>
    </SWRConfig>
  );
}

/**
 * We get translation on the App - to make sure eg. custom errorpages also get them
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 */
MyApp.getInitialProps = async (ctx) => {
  if (typeof window !== "undefined") {
    return { pageProps: { initialState: {} } };
  }

  const appProps = await App.getInitialProps(ctx);
  return {
    pageProps: {
      ...appProps?.pageProps,
      translations: await fetchTranslations(),
    },
  };
};

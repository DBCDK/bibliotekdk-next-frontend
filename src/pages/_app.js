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
import { Provider } from "next-auth/client";
import smoothscroll from "smoothscroll-polyfill";

import Head from "next/head";

import "@/scss/custom-bootstrap.scss";
import "@/css/styles.css";

import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";

import { APIStateContext } from "@/lib/api/api";
import { AnonymousSessionContext } from "@/components/hooks/useUser";
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
import Feedback from "@/components/feedback";
import { SkipToMainLink } from "@/components/base/skiptomain/SkipToMain";

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

  setLocale(router.locale);
  // pass translations to Translate component - it might be false -
  // let Translate component handle whatever could be wrong with the result
  setTranslations(pageProps.translations);
  // Restore scrollPosition on page change (where page using getServersideProps)
  useScrollRestoration(router);

  return (
    <Provider
      session={pageProps.session}
      options={{
        clientMaxAge: 60, // Re-fetch session if cache is older than 60 seconds
        keepAlive: 5 * 60, // Send keepAlive message every 5 minutes
      }}
    >
      <AnonymousSessionContext.Provider value={pageProps.anonSession}>
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
              <Modal.Page id="pickup" component={Pages.Pickup} />
              <Modal.Page id="loanerform" component={Pages.Loanerform} />
              <Modal.Page id="receipt" component={Pages.Receipt} />
              <Modal.Page id="login" component={Pages.Login} />
              <Modal.Page id="localizations" component={Pages.Localizations} />
            </Modal.Container>

            <Matomo allowCookies={allowCookies} />
            <BodyScrollLock router={router} />
            <div id="layout">
              <Head>
                <meta name="mobile-web-app-capable" content="yes"></meta>
                <meta name="theme-color" content="#3333ff"></meta>
              </Head>
              <SkipToMainLink />
              <Banner />
              <Notifications />
              <HelpHeader />

              <Component {...pageProps} />
              <Feedback />
              <CookieBox />
              <Footer />
            </div>
          </Modal.Provider>
        </APIStateContext.Provider>
      </AnonymousSessionContext.Provider>
    </Provider>
  );
}

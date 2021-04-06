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
import Modal from "@/components/modal";
import useScrollRestoration from "@/components/hooks/useScrollRestoration";
import CookieBox, { COOKIES_ALLOWED } from "@/components/cookiebox";
import Notifications from "@/components/base/notifications/Notifications";
import HelpHeader from "@/components/help/header";

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
    <APIStateContext.Provider value={pageProps.initialState}>
      <Matomo allowCookies={allowCookies} />
      <BodyScrollLock router={router} />
      <Modal router={router} />
      <div id="layout">
        <Banner />
        <Notifications />
        <HelpHeader />
        <Component {...pageProps} />
        <CookieBox />
        <Footer />
      </div>
    </APIStateContext.Provider>
  );
}

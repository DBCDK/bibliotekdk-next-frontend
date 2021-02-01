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

import "@/scss/custom-bootstrap.scss";
import "@/css/styles.css";

import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";

import { APIStateContext } from "@/lib/api/api";
import {
  setLocale,
  setTranslations,
  checkTranslationsObject,
} from "@/components/base/translate/Translate";

import fetchTranslations from "@/lib/api/backend";

import App from "next/app";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Matomo from "@/components/matomo";
import BodyScrollLock from "@/components/scroll/lock";
import useScrollRestoration from "@/components/hooks/useScrollRestoration";

export default function MyApp({ Component, pageProps, router }) {
  setLocale(router.locale);
  // pass translations to Translate component - it might be false -
  // let Translate component handle that
  if (pageProps.translations) {
    setTranslations(pageProps.translations);
  }
  // Restore scrollPosition on page change (where page using getServersideProps)
  useScrollRestoration(router);
  return (
    <APIStateContext.Provider value={pageProps.initialState}>
      <Matomo />
      <BodyScrollLock />
      <Header router={router} />
      <Component {...pageProps} />
      <Footer />
    </APIStateContext.Provider>
  );
}

// Server side render all pages..
// Else publicRuntimeConfig doesn't work
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  // get translations from backend
  let transProps = await fetchTranslations();

  // check if translation object is good
  if (!checkTranslationsObject(transProps)) {
    // @TODO log this error
    transProps = false;
  }
  // add them to pageprops - @see above (MyApp)
  appProps.pageProps.translations = transProps;
  return { ...appProps };
};

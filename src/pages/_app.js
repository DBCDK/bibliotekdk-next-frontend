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

import "../scss/custom-bootstrap.scss";
import "../css/styles.css";

import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";

import { APIStateContext } from "@/lib/api/api";
import {
  setLocale,
  setTranslations,
} from "@/components/base/translate/Translate";

import fetchTranslations from "@/lib/api/backend";

import App from "next/app";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Matomo from "@/components/matomo";
import BodyScrollLock from "@/components/scroll/lock";

export default function MyApp({ Component, pageProps, router }) {
  setLocale(router.locale);
  // pass translations to Translate component - it might be false -
  // let Translate component handle that
  setTranslations(pageProps.translations);
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

/**
 * Check if translations are OK
 * @param translations
 * @return boolean
 *
 * @TODO more checks
 */
function checkTranslationsObject(transProps) {
  if (!transProps) {
    return false;
  }
  // is it an object ?
  if (!(transProps.constructor === Object)) {
    return false;
  }
  // check status - translate may return false
  if (transProps.ok === false) {
    return false;
  }
  // does it have a translations.context section ?
  if (!transProps.translations.contexts) {
    return false;
  }

  return true;
}

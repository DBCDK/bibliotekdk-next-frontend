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
import { setLocale } from "@/components/base/translate/Translate";

import App from "next/app";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Matomo from "@/components/matomo";

export default function MyApp({ Component, pageProps, router }) {
  setLocale(router.locale);
  return (
    <APIStateContext.Provider value={pageProps.initialState}>
      <Matomo />
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
  return { ...appProps };
};

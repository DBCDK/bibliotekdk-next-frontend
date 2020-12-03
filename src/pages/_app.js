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
import Head from "next/head";

import "../scss/custom-bootstrap.scss";
import "../css/styles.css";

import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";

import { APIStateContext } from "@/lib/api/api";
import { setLocale } from "@/components/base/translate/Translate";

import Header from "@/components/header";
import Footer from "@/components/footer";
import Matomo from "@/components/matomo";
const TITLE = "Søg, find og lån fra alle Danmarks biblioteker";
const DESCRIPTION =
  "bibliotek.dk er din indgang til bibliotekernes fysiske og digitale materialer.";
export default function MyApp({ Component, pageProps, router }) {
  setLocale(router.locale);
  return (
    <APIStateContext.Provider value={pageProps.initialState}>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION}></meta>
        <meta property="og:url" content="https://beta.bibliotek.dk" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
      </Head>
      <Matomo />
      <Header />
      <Component {...pageProps} />
      <Footer />
    </APIStateContext.Provider>
  );
}

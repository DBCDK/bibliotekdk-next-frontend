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
// import "bootstrap/dist/css/bootstrap.min.css";
import "../css/styles.css";
import "lazysizes";

import { APIStateContext } from "../lib/api/api";

export default function MyApp({ Component, pageProps }) {
  return (
    <APIStateContext.Provider value={pageProps.initialState}>
      <Component {...pageProps} />
    </APIStateContext.Provider>
  );
}

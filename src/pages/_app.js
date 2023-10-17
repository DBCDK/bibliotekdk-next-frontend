/**
 * @file
 * This is a custom app component.
 * We use it to override default behaviour.
 * See https://nextjs.org/docs/advanced-features/custom-app
 *
 * Specifically, we make sure pages are wrapped with the
 * SWRConfig, such that the data fetched
 * via getServerSideProps is used when the React app
 * is rendered.
 */
import React from "react";

import { SessionProvider } from "next-auth/react";
import smoothscroll from "smoothscroll-polyfill";

import { SWRConfig } from "swr";

import { destroy } from "@dbcdk/login-nextjs/client";

import "@/scss/custom-bootstrap.scss";
import "@/css/styles.css";

import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";

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
import Notifications from "@/components/base/notifications/Notifications";
import HelpHeader from "@/components/help/header";
import FeedBackLink from "@/components/feedbacklink";
import { SkipToMainLink } from "@/components/base/skiptomain/SkipToMain";
import { Listener as FFUUserListener } from "@/components/ffu";

import Head from "@/components/head";

import fetchTranslations from "@/lib/api/backend";
import App from "next/app";
import SetPickupBranch from "@/components/utils/SetPickupBranch";
import { enableDebug } from "@/lib/api/api";

import ErrorPage from "./500";
import { BookmarkSyncProvider } from "@/components/hooks/useBookmarks";

// kick off the polyfill!
if (typeof window !== "undefined") {
  smoothscroll.polyfill();
}

/**
 * Error Boundary for handling client side errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Log the error on the server
    if (typeof window !== "undefined") {
      fetch("/api/errorLogger", {
        method: "POST",
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        }),
      });
    }
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

let pageProps;

export default function MyApp({ Component, pageProps: _pageProps, router }) {
  // sync pageProps
  pageProps = { ...pageProps, ..._pageProps };

  setLocale(router.locale);
  // pass translations to Translate component - it might be false -
  // let Translate component handle whatever could be wrong with the result
  setTranslations(pageProps.translations);

  // swr global confuguration options
  const swrConfigValue = {
    fallback: pageProps.initialData || {},
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

  if (router?.query?.debug === "true") {
    enableDebug();
  }

  return (
    <ErrorBoundary>
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
              <Modal.Page id="mobileLogin" component={Pages.MobileLogin} />
              <Modal.Page id="filter" component={Pages.Filter} />
              <Modal.Page id="references" component={Pages.References} />
              <Modal.Page id="material" component={Pages.Material} />
              <Modal.Page id="deleteOrder" component={Pages.DeleteOrder} />
              <Modal.Page id="addLibrary" component={Pages.AddLibrary} />
              <Modal.Page id="verify" component={Pages.Verify} />
              <Modal.Page id="statusMessage" component={Pages.StatusMessage} />

              <Modal.Page
                id="orderHistoryDataConsent"
                component={Pages.OrderHistoryDataConsent}
              />

              <Modal.Page
                id="openAdgangsplatform"
                component={Pages.OpenAdgangsplatform}
              />
              <Modal.Page
                id="loginNotSupported"
                component={Pages.LoginNotSupported}
              />
              <Modal.Page
                id="manifestationContent"
                component={Pages.ManifestationContent}
              />
              <Modal.Page
                id="agencyLocalizations"
                component={Pages.AgencyLocalizations}
              />
              <Modal.Page
                id="branchLocalizations"
                component={Pages.BranchLocalizations}
              />
              <Modal.Page id="branchDetails" component={Pages.BranchDetails} />
            </Modal.Container>
            <Head />
            <Matomo />
            <BodyScrollLock router={router} />
            <div id="layout">
              <SkipToMainLink />
              <Banner />
              <Notifications />
              <HelpHeader />
              <Component {...pageProps} />
              <FeedBackLink />
              <Footer />
            </div>

            {/* watch for FFU user logins - propt the users to create an bibdk account */}
            <FFUUserListener />
          </Modal.Provider>

          {/* SetPickupBranch listens for users just logged in via adgangsplatformen */}
          <SetPickupBranch router={router} />

          <BookmarkSyncProvider />
        </SessionProvider>
      </SWRConfig>
    </ErrorBoundary>
  );
}

/**
 * We get translation on the App - to make sure eg. custom errorpages also get them
 * @see https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 */
MyApp.getInitialProps = async (ctx) => {
  if (typeof window !== "undefined") {
    return { pageProps: {} };
  }

  const appProps = await App.getInitialProps(ctx);
  return {
    pageProps: {
      ...appProps?.pageProps,
      translations: await fetchTranslations(),
    },
  };
};

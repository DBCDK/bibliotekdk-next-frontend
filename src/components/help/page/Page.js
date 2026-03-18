import Head from "next/head";

import Container from "react-bootstrap/Container";

import Faq from "@/components/help/faq/promoted";
import Sections from "../sections";
import Contact from "../contact";
import Translate from "@/components/base/translate";
import useSiteConfig from "@/components/hooks/useSiteConfig";

import styles from "./Page.module.css";
import React from "react";

/**
 * The Articles page React component
 *
 * @returns {React.JSX.Element}
 *
 */

export default function Page() {
  const context = { context: "metadata" };
  const { buildMetadata } = useSiteConfig();

  const pageTitle = Translate({
    ...context,
    label: "help-title",
  });

  const pageDescription = Translate({
    ...context,
    label: "help-description",
  });
  const metadata = buildMetadata({
    title: pageTitle,
    description: pageDescription,
  });

  return (
    <React.Fragment>
      <Head>
        <title key="title">{metadata.title}</title>
        <meta
          key="description"
          name="description"
          content={metadata.description}
        ></meta>
        <meta
          key="og:type"
          property="og:type"
          content={metadata.openGraphType}
        />
        <meta key="og:title" property="og:title" content={metadata.title} />
        <meta
          key="og:site_name"
          property="og:site_name"
          content={metadata.siteName}
        />
        <meta
          key="og:description"
          property="og:description"
          content={metadata.description}
        />
        <meta key="og:image" property="og:image" content={metadata.image} />
        <meta name="referrer" content={metadata.referrer} />
        <meta
          name="mobile-web-app-capable"
          content={metadata.mobileWebAppCapable}
        ></meta>
        <meta name="theme-color" content={metadata.themeColor}></meta>
      </Head>
      <main>
        <Container className={styles.top} fluid>
          <Faq className={styles.faq} />
          <Sections />
          <Contact />
        </Container>
      </main>
    </React.Fragment>
  );
}

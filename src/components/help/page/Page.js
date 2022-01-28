import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import Faq from "@/components/help/faq/promoted";
import Sections from "../sections";
import Contact from "../contact";
import Translate from "@/components/base/translate";

import styles from "./Page.module.css";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import React from "react";

/**
 * The Articles page React component
 *
 * @returns {component}
 *
 */

export default function Page() {
  const context = { context: "metadata" };

  const pageTitle = Translate({
    ...context,
    label: "help-title",
  });

  const pageDescription = Translate({
    ...context,
    label: "help-description",
  });

  const { canonical, alternate, root } = useCanonicalUrl();

  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta property="og:url" content={canonical.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content={`${root}/img/bibdk-og-cropped.jpg`}
        />
        {alternate.map(({ locale, url }) => (
          <link key={url} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>
      <main>
        <Container className={styles.top} fluid>
          <Faq className={styles.faq} />
          <Sections className={styles.sections} />
          <Contact />
        </Container>
      </main>
    </React.Fragment>
  );
}

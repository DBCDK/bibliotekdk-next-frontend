import Head from "next/head";

import Container from "react-bootstrap/Container";

import Faq from "@/components/help/faq/promoted";
import Sections from "../sections";
import Contact from "../contact";
import Translate from "@/components/base/translate";

import styles from "./Page.module.css";
import React from "react";

/**
 * The Articles page React component
 *
 * @returns {React.ReactElement | null}
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

  return (
    <React.Fragment>
      <Head>
        <title key="title">{pageTitle}</title>
        <meta
          key="description"
          name="description"
          content={pageDescription}
        ></meta>
        <meta key="og:title" property="og:title" content={pageTitle} />
        <meta
          key="og:description"
          property="og:description"
          content={pageDescription}
        />
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

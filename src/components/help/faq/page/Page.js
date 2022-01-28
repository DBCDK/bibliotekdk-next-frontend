import Head from "next/head";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Faq from "@/components/help/faq/published";
import HelpTextMenu from "@/components/help/menu";
import Breadcrumbs from "@/components/base/breadcrumbs";
import Translate from "@/components/base/translate";

import styles from "./Page.module.css";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import React from "react";

/**
 * The FAQ page
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
          <Row>
            <Col xs={12} lg={{ span: 3 }}>
              <HelpTextMenu className={styles.menu} />
              <Breadcrumbs
                path={[
                  Translate({ context: "help", label: "help-breadcrumb" }),
                ]}
                href={{ pathname: "/hjaelp" }}
                seperatorTail={true}
                className={styles.breadcrumbs}
              />
            </Col>
            <Col xs={12} lg={{ span: 6 }}>
              <Faq className={styles.faq} />
            </Col>
          </Row>
        </Container>
      </main>
    </React.Fragment>
  );
}

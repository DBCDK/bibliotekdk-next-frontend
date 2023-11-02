import Head from "next/head";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Faq from "@/components/help/faq/published";
import HelpTextMenu from "@/components/help/menu";
import Breadcrumbs from "@/components/base/breadcrumbs";
import Translate from "@/components/base/translate";

import styles from "./Page.module.css";
import React from "react";

/**
 * The FAQ page
 *
 * @returns {React.JSX.Element}
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
          <Row>
            <Col xs={12} lg={3}>
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
            <Col xs={12} lg={6}>
              <Faq />
            </Col>
          </Row>
        </Container>
      </main>
    </React.Fragment>
  );
}

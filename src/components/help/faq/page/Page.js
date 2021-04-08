import Head from "next/head";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Faq from "@/components/help/faq/published";
import HelpTextMenu from "@/components/help/menu";

import styles from "./Page.module.css";

/**
 * The FAQ page
 *
 * @returns {component}
 *
 */
export default function Page() {
  const pageTitle = "Ofte stillede spørgsmål | alfa.bibliotek.dk";
  const pageDescription =
    "bibliotek.dk er din indgang til bibliotekernes fysiske og digitale materialer.";

  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta
          property="og:url"
          content="https://alfa.bibliotek.dk/hjaelp/find"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:url"
          content="https://alfa.bibliotek.dk/hjaelp/find"
        />
      </Head>
      <main>
        <Container className={styles.top} fluid>
          <Row>
            <Col xs={12} lg={{ span: 3 }}>
              <HelpTextMenu className={styles.menu} />
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

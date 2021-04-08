import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import Faq from "@/components/help/faq/promoted";
import Sections from "../sections";
import Contact from "../contact";
import Translate from "@/components/base/translate";

import styles from "./Page.module.css";
import Link from "@/components/base/link";
import Text from "@/components/base/text";

/**
 * Back to bibliotek.dk button
 *
 * @returns {component}
 */
function BackButton() {
  return (
    <div className={styles.back}>
      <Link href="/" border={{ bottom: { keepVisible: true } }}>
        <Text>{Translate({ context: "help", label: "back-to-bib" })}</Text>
      </Link>
    </div>
  );
}

/**
 * The Articles page React component
 *
 * @returns {component}
 *
 */

export default function Page() {
  const pageTitle = "Hjælp og vejledninger | alfa.bibliotek.dk";
  const pageDescription =
    "bibliotek.dk er din indgang til bibliotekernes fysiske og digitale materialer.";

  return (
    <React.Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta property="og:url" content="https://alfa.bibliotek.dk/hjaelp" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content="https://alfa.bibliotek.dk/hjaelp" />
      </Head>
      <main>
        <Container className={styles.top} fluid>
          <Row>
            <Col xs={12} lg={{ span: 3 }}>
              <BackButton />
            </Col>
          </Row>
        </Container>
        <Faq className={styles.faq} />
        <Sections className={styles.sections} />
        <Contact />
      </main>
    </React.Fragment>
  );
}

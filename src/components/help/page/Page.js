import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import Title from "@/components/base/title";
import Faq from "../faq";
import Sections from "../sections";
import Search from "../search";
import Contact from "../contact";

import Header from "../header";

import Translate from "@/components/base/translate";

import styles from "./Page.module.css";

/**
 * The Articles page React component
 *
 * @returns {component}
 *
 */

export default function Page() {
  const pageTitle = "Alle Artikler | alfa.bibliotek.dk";
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
      <Header />
      <main>
        <Container className={styles.top} fluid>
          <Row>
            <Col xs={12} lg={{ span: 9, offset: 3 }}>
              <Title type="title3">
                {Translate({ context: "help", label: "help-title" })}
              </Title>
            </Col>
          </Row>
        </Container>
        <Search />
        <Faq className={styles.faq} />
        <Sections className={styles.sections} />
        <Contact />
      </main>
    </React.Fragment>
  );
}

import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import Section from "@/components/base/section";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Faq from "../faq";

import Header from "../header";

import Translate from "@/components/base/translate";

import styles from "./Page.module.css";

/**
 * Back to bibliotek.dk button
 *
 * @returns {component}
 */
function BackButton() {
  return (
    <div className={styles.back}>
      <Link href="/" border={{ bottom: { keepVisible: true } }}>
        <Text>Tilbage til bibliotek.dk</Text>
      </Link>
    </div>
  );
}

/**
 * The Articles page React component
 *
 * @returns {component}
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
              <Title type="title3">Hjælp og vejledninger</Title>
            </Col>
          </Row>
        </Container>
        <Section
          className={styles.search}
          title={<BackButton />}
          titleDivider={false}
          contentDivider={false}
        >
          <input placeholder="Søg i hjælp" />
        </Section>
        <Section className={styles.faq} title="Ofte stillede spørgsmål">
          <Faq />
        </Section>
      </main>
    </React.Fragment>
  );
}

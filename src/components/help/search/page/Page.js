import Head from "next/head";

import { Container, Row, Col } from "react-bootstrap";

import Result from "@/components/help/search/result";

import { useData } from "@/lib/api/api";
import { helpTextSearch } from "@/lib/api/helptexts.fragments";
import { useRouter } from "next/router";
import Faq from "@/components/help/faq";
import HelpTextMenu from "@/components/helptexts/menu";

import styles from "./Page.module.css";

/**
 * The Articles page React component
 *
 * @returns {component}
 *
 */

export function Page({ result, isLoading, query }) {
  const pageTitle = "Alle Artikler | alfa.bibliotek.dk";
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
              <Result result={result} isLoading={isLoading} query={query} />
            </Col>
          </Row>
        </Container>
        {((!isLoading && result?.length) === 0 || !query) && (
          <Faq className={styles.faq} />
        )}
      </main>
    </React.Fragment>
  );
}

export default function Wrap() {
  const router = useRouter();
  const { q } = router.query;
  const { isLoading, data } = useData(q && helpTextSearch(q));

  return <Page result={data?.help?.result} isLoading={isLoading} query={q} />;
}

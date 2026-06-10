import React from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Result from "@/components/help/search/result";
import Faq from "@/components/help/faq/promoted";
import HelpTextMenu from "@/components/help/menu";
import Head from "@/components/head";
import Translate from "@/components/base/translate";

import { useData } from "@/lib/api/api";
import { helpTextSearch } from "@/lib/api/helptexts.fragments";
import { useRouter } from "next/router";

import styles from "./Page.module.css";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";


function truncateBody(body = "") {
  const maxLength = 200;
  return body.length > maxLength ? `${body.slice(0, maxLength)}...` : body;
}

/**
 * Will truncate the body of the help text to the max length and add an ellipsis
 */
function normalizeHelpTextSearchResults(helpTexts = []) {
  return helpTexts.map(({ documentId, title, body, group }) => ({
    id: documentId,
    nid: documentId,
    orgTitle: title,
    title,
    body: truncateBody(body),
    group,
  }));
}

/**
 * The page showing help search results
 *
 * @returns {React.JSX.Element}
 *
 */
export function Page({ result, isLoading, query }) {
  const context = { context: "metadata" };

  const pageTitle = Translate({
    ...context,
    label: "help-title",
  });
  const pageDescription = Translate({
    ...context,
    label: "help-description",
  });

  const { canonical, alternate } = useCanonicalUrl({
    preserveParams: ["q"],
  });

  return (
    <React.Fragment>
      <Head
        title={pageTitle}
        description={pageDescription}
        canonical={canonical.url}
        alternate={alternate}
      />
      <main>
        <Container className={styles.top} fluid>
          <Row>
            <Col xs={12} lg={3}>
              <HelpTextMenu className={styles.menu} />
            </Col>
            <Col xs={12} lg={6}>
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
Page.propTypes = {
  result: PropTypes.array,
  isLoading: PropTypes.bool,
  query: PropTypes.string,
};

/**
 * We get hold of the url query parameter 'q'
 * and make a help search request.
 *
 * And then pass it all to the result page
 */
export default function Wrap() {
  const router = useRouter();
  const { q } = router.query;
  const { isLoading, data } = useData(q && helpTextSearch({ q }));
  const result = normalizeHelpTextSearchResults(
    data?.bibliotekdkCms?.helpTexts
  );

  return <Page result={result} isLoading={isLoading} query={q} />;
}

import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Result from "@/components/help/search/result";
import Faq from "@/components/help/faq/promoted";
import HelpTextMenu from "@/components/help/menu";
import Translate from "@/components/base/translate";

import { useData } from "@/lib/api/api";
import { helpTextSearch } from "@/lib/api/helptexts.fragments";
import { useRouter } from "next/router";

import styles from "./Page.module.css";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import useSiteConfig from "@/components/hooks/useSiteConfig";

/**
 * The page showing help search results
 *
 * @returns {React.JSX.Element}
 *
 */
export function Page({ result, isLoading, query }) {
  const context = { context: "metadata" };
  const { buildMetadata } = useSiteConfig();

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
  const metadata = buildMetadata({
    title: pageTitle,
    description: pageDescription,
  });

  return (
    <React.Fragment>
      <Head>
        <title key="title">{metadata.title}</title>
        <meta
          key="description"
          name="description"
          content={metadata.description}
        ></meta>
        <meta key="og:url" property="og:url" content={canonical.url} />
        <meta
          key="og:type"
          property="og:type"
          content={metadata.openGraphType}
        />
        <meta key="og:title" property="og:title" content={metadata.title} />
        <meta
          key="og:site_name"
          property="og:site_name"
          content={metadata.siteName}
        />
        <meta
          key="og:description"
          property="og:description"
          content={metadata.description}
        />
        <meta key="og:image" property="og:image" content={metadata.image} />
        <meta name="referrer" content={metadata.referrer} />
        {alternate.map(({ locale, url }) => (
          <link key={locale} rel="alternate" hreflang={locale} href={url} />
        ))}
        <meta
          name="mobile-web-app-capable"
          content={metadata.mobileWebAppCapable}
        ></meta>
        <meta name="theme-color" content={metadata.themeColor}></meta>
      </Head>
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

  return <Page result={data?.help?.result} isLoading={isLoading} query={q} />;
}

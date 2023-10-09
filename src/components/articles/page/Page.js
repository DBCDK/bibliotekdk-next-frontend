import Head from "next/head";

import { useRouter } from "next/router";

import Section from "@/components/base/section";
import Articles from "@/components/articles";
import Header from "@/components/header/Header";

import Translate from "@/components/base/translate";

import styles from "./Page.module.css";
import React from "react";

/**
 * The Articles page React component
 *
 * @returns {React.ReactElement | null}
 */
export default function Page() {
  const router = useRouter();
  const context = { context: "metadata" };

  const pageTitle = Translate({
    ...context,
    label: "all-articles-title",
  });
  const pageDescription = Translate({
    ...context,
    label: "frontpage-description",
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
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content={pageTitle} />
        <meta
          key="og:description"
          property="og:description"
          content={pageDescription}
        />
      </Head>
      <Header router={router} />
      <main>
        <Section
          className={styles.articles}
          title={Translate({ context: "articles", label: "section-title" })}
          divider={{ content: false }}
        >
          <Articles />
        </Section>
      </main>
    </React.Fragment>
  );
}

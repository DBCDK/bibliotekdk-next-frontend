import { useRouter } from "next/router";

import Section from "@/components/base/section";
import Articles from "@/components/articles";
import Header from "@/components/header/Header";
import Head from "@/components/head";

import Translate from "@/components/base/translate";

import styles from "./Page.module.css";
import React from "react";

/**
 * The Articles page React component
 *
 * @returns {React.JSX.Element}
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
      <Head title={pageTitle} description={pageDescription} />
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

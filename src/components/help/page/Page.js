import Head from "next/head";

import Section from "@/components/base/section";

import Header from "../header";

import Translate from "@/components/base/translate";

import styles from "./Page.module.css";

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
        <Section
          className={styles.search}
          title={Translate({ context: "articles", label: "section-title" })}
          titleDivider={false}
          contentDivider={false}
        >
          ...
        </Section>
      </main>
    </React.Fragment>
  );
}

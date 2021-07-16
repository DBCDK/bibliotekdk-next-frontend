import Head from "next/head";

import { useRouter } from "next/router";

import Section from "@/components/base/section";
import Articles from "@/components/articles";
import Header from "@/components/header/Header";

import Translate from "@/components/base/translate";

import styles from "./Page.module.css";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";

/**
 * The Articles page React component
 *
 * @returns {component}
 */
export default function Page() {
  const router = useRouter();
  const context = { context: "metadata" };

  const { canonical, alternate, root } = useCanonicalUrl();

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
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}></meta>
        <meta property="og:url" content={canonical.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content={`${root}/img/bibdk-og-cropped.jpg`}
        />
        {alternate.map(({ locale, url }) => (
          <link key={url} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>
      <Header router={router} />
      <main>
        <Section
          className={styles.articles}
          title={Translate({ context: "articles", label: "section-title" })}
          contentDivider={false}
        >
          <Articles />
        </Section>
      </main>
    </React.Fragment>
  );
}

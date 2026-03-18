import Head from "next/head";

import { useRouter } from "next/router";

import Section from "@/components/base/section";
import Articles from "@/components/articles";
import Header from "@/components/header/Header";

import Translate from "@/components/base/translate";
import useSiteConfig from "@/components/hooks/useSiteConfig";

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
  const { buildMetadata } = useSiteConfig();

  const pageTitle = Translate({
    ...context,
    label: "all-articles-title",
  });
  const pageDescription = Translate({
    ...context,
    label: "frontpage-description",
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
        <meta
          name="mobile-web-app-capable"
          content={metadata.mobileWebAppCapable}
        ></meta>
        <meta name="theme-color" content={metadata.themeColor}></meta>
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

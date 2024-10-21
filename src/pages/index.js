/**
 * @file
 * This is the index page of the application
 *
 */

import Head from "next/head";

import Hero from "@/components/hero";
import { promotedArticles } from "@/lib/api/article.fragments";
import { fetchAll } from "@/lib/api/apiServerOnly";
import Header from "@/components/header/Header";
import React from "react";
import { frontpageHero } from "@/lib/api/hero.fragments";

import { useData } from "@/lib/api/api";
import { parseHero } from "@/components/hero/Hero";

const Index = () => {
  const { data } = useData(frontpageHero());
  const ogImage = parseHero(data);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Head>
          {ogImage && ogImage.image && ogImage.image.ogurl && (
            <meta
              key="og:image"
              property="og:image"
              content={`${ogImage?.image?.ogurl}`}
            />
          )}
        </Head>
      </main>
    </>
  );
};

/**
 * These queries are run on the server.
 * I.e. the data fetched will be used for server side rendering
 */
const serverQueries = [promotedArticles, frontpageHero];

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Index.getInitialProps = async (ctx) => {
  return await fetchAll(serverQueries, ctx);
};

export default Index;

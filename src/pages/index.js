/**
 * @file
 * This is the index page of the application
 */

import Head from "next/head";

import { ArticleSection } from "@/components/article/section";
import Hero from "@/components/hero";
import { fetchAll } from "@/lib/api/apiServerOnly";
import Header from "@/components/header/Header";
import React from "react";
import { InspirationSlider } from "@/components/inspiration";
import { LinkCard } from "@/components/linkcard";

import { useData } from "@/lib/api/api";
import { parseCmsHero } from "@/components/hero/Hero";
import { cmsFrontpage, getCmsFrontpage } from "@/lib/api/frontpage.fragments";
import { normalizeArticle } from "@/lib/api/article.fragments";

const Index = () => {
  const { data } = useData(cmsFrontpage());
  const frontpage = getCmsFrontpage(data);
  const ogImage = parseCmsHero(data);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Head>
          {ogImage?.image?.ogurl && (
            <meta
              key="og:image"
              property="og:image"
              content={ogImage.image.ogurl}
            />
          )}
        </Head>

        {frontpage?.sections?.filter(Boolean).map((section) => {
          if (
            section.__typename ===
            "BibliotekdkCmsComponentFrontpageSection"
          ) {
            return (
              <ArticleSection
                key={section.id}
                title={section.title}
                articles={section.articles?.map(normalizeArticle)}
                template={section.template}
              />
            );
          }

          if (
            section.__typename ===
            "BibliotekdkCmsComponentFrontpageInspirationSlider"
          ) {
            return (
              <InspirationSlider
                key={section.id}
                title={section.title}
                filters={[
                  {
                    category: section.category,
                    subCategories: ["nyeste"],
                  },
                ]}
                limit={section.limit || 30}
                divider={{ content: !section.showDivider }}
              />
            );
          }

          if (
            section.__typename ===
            "BibliotekdkCmsComponentFrontpageLinkCard"
          ) {
            return (
              <LinkCard
                key={section.id}
                title={section.title}
                buttonText={section.buttonText}
                url={section.url}
                image={section.image}
              />
            );
          }

          return null;
        })}
      </main>
    </>
  );
};

/**
 * These queries are run on the server for SSR.
 */
const serverQueries = [cmsFrontpage];

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

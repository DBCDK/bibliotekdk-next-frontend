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
import { Slider as InspirationSliderSkeleton } from "@/components/inspiration/slider/Slider";
import { LinkCard } from "@/components/linkcard";

import { useData } from "@/lib/api/api";
import { parseCmsHero } from "@/components/hero/Hero";
import { cmsFrontpage, getCmsFrontpage } from "@/lib/api/frontpage.fragments";
import { normalizeArticle } from "@/lib/api/article.fragments";
import { getLocale } from "@/components/base/translate/Translate";

const sectionBackgroundColors = ["var(--parchment)", "var(--jagged-ice)"];

/**
 * TODO: use colors from CMS instead
 * Get the background color for every second section.
 * Returns null for the other sections.
 */
function getSectionBackgroundColor(index) {
  //null -> no background color(white)
  if (index % 2 === 0) {
    return null;
  }
  // Use half the section index to rotate through colors on every second section.
  const colorIndex = Math.floor(index / 2) % sectionBackgroundColors.length;
  return sectionBackgroundColors[colorIndex];
}
/**
 * Get a unique key for a frontpage section.
 */
function getSectionKey(section, index, locale) {
  return `${locale}-${section.__typename}-${section.id ?? index}`;
}

const FrontpageSkeleton = () => (
  <>
    <ArticleSection
      title=""
      articles={Array(3).fill({})}
      skeleton
      template="triple"
    />
    <InspirationSliderSkeleton isLoading data={[]} lazyLoad={false} />
    <InspirationSliderSkeleton isLoading data={[]} lazyLoad={false} />
    <ArticleSection
      title=""
      articles={Array(2).fill({})}
      skeleton
      template="double"
    />
  </>
);

const Index = () => {
  const locale = getLocale();
  const { data, isLoading } = useData(cmsFrontpage({ locale }));
  const frontpage = getCmsFrontpage(data);
  const ogImage = parseCmsHero(data);
  const showSkeleton = isLoading || !frontpage?.sections;

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

        {showSkeleton && <FrontpageSkeleton />}

        {!showSkeleton &&
          frontpage?.sections?.filter(Boolean).map((section, index) => {
            const backgroundColor = getSectionBackgroundColor(index);

            if (
              section.__typename === "BibliotekdkCmsComponentFrontpageSection"
            ) {
              return (
                <ArticleSection
                  key={getSectionKey(section, index, locale)}
                  title={section.title}
                  articles={section.articles?.map(normalizeArticle)}
                  template={section.template}
                  color={backgroundColor}
                />
              );
            }

            if (
              section.__typename ===
              "BibliotekdkCmsComponentFrontpageInspirationSlider"
            ) {
              return (
                <InspirationSlider
                  key={getSectionKey(section, index, locale)}
                  title={section.title}
                  filters={[
                    {
                      category: section.category,
                      subCategories: section.subcategories || ["nyeste"],
                    },
                  ]}
                  limit={section.limit || 30}
                  divider={{ content: !section.showDivider }}
                  backgroundColor={backgroundColor}
                />
              );
            }

            if (
              section.__typename === "BibliotekdkCmsComponentFrontpageLinkCard"
            ) {
              return (
                <LinkCard
                  key={getSectionKey(section, index, locale)}
                  title={section.title}
                  buttonText={section.buttonText}
                  url={section.url}
                  image={section.image}
                  backgroundColor={backgroundColor}
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

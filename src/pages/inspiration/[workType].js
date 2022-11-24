/**
 * @file
 * This is the inspiration page
 *
 * Next.js page docs are found here
 * https://nextjs.org/docs/basic-features/pages
 *
 * Note that dynamic routing (file based) is used on this page.
 * https://nextjs.org/docs/routing/dynamic-routes
 *
 * Path parameters on this page:
 *  - workType: type of work
 *
 */
import Head from "next/head";
import { useRouter } from "next/router";
import merge from "lodash/merge";

import { useData } from "@/lib/api/api";
import * as inspirationFragments from "@/lib/api/inspiration.fragments";
import { frontpageHero } from "@/lib/api/hero.fragments";

import { fetchAll } from "@/lib/api/apiServerOnly";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";

import Header from "@/components/header";
import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

import Slider from "@/components/inspiration/slider";

// worktype to categories
const WORKTYPE_TO_CATEGORIES = {
  artikler: ["articles"],
  spil: ["games"],
  boeger: [
    "fiction",
    "nonfiction",
    "childrenBooksNonfiction",
    "childrenBooksFiction",
  ],
  film: ["movies"],
  musik: ["music"],
  noder: ["sheetMusic"],
};

// custom filters for a specific category
const CATEGORY_FILTERS = {
  childrenBooksNonfiction: ["nyeste", "populære"],
  childrenBooksFiction: ["nyeste", "populære"],
  nonfiction: ["nyeste", "populære"],
};

// category color
const CATEGORY_COLOR = {
  articles: "var(--parchment)",
  games: "var(--pippin)",
  fiction: "var(--jagged-ice)",
  movies: "var(--parchment)",
  music: "var(--pippin)",
  sheetMusic: "var(--jagged-ice)",
};

/**
 * Function to trim keys for translations
 * lowercase + space replaced with '-'
 *
 * @param {*} str
 * @returns
 */
export function trim(str) {
  return str.replace(/\s/g, "-")?.toLowerCase() || str;
}

export function Page({ data, categories, isLoading }) {
  if (isLoading) {
    data = [
      {
        category: "loading",
        subCategories: [...new Array(10).fill({ works: [] })],
      },
    ];
  }

  const context = "inspiration";

  // use first element in the categories array as label key (for transltations)
  const label = data?.[0]?.category;

  // SEO
  const { canonical, alternate } = useCanonicalUrl();
  const title = Translate({ context, label: trim(`title-${label}`) });
  const description = Translate({
    context,
    label: trim(`description-${label}`),
  });

  // counter used for slide colors
  let count = 0;

  return (
    <>
      <Header />
      <Head>
        {!isLoading && <title key="title">{title}</title>}
        <meta key="description" name="description" content={description} />
        <meta key="og:url" property="og:url" content={canonical.url} />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        {alternate.map(({ locale, url }) => (
          <link key={locale} rel="alternate" hreflang={locale} href={url} />
        ))}
      </Head>
      <Section
        title={
          <Title type="title3" skeleton={isLoading}>
            {title}
          </Title>
        }
        backgroundColor={CATEGORY_COLOR[label] || "var(--parchment)"}
        space={{ top: "var(--pt4)", bottom: "var(--pt4)" }}
      >
        <Text
          className="inspiration-section-description"
          type="text2"
          skeleton={isLoading}
          lines={3}
        >
          {Translate({ context, label: trim(`description-${label}`) })}
        </Text>
      </Section>

      {data?.map(({ category, subCategories }, i) =>
        subCategories.map((sub, idx) => {
          const backgroundColor =
            count % 2 == 0 ? null : CATEGORY_COLOR[label] || "var(--parchment)";

          count++;

          return (
            <Slider
              key={`inspiration-${sub}-${idx}`}
              title={
                sub.title &&
                Translate({
                  context,
                  label: trim(`category-${category}-${sub.title}`),
                })
              }
              limit={30}
              category={category}
              filters={[{ category, subCategories: sub.title }]}
              backgroundColor={backgroundColor}
              divider={{ content: false }}
            />
          );
        })
      )}
    </>
  );
}

export default function Wrap() {
  const router = useRouter();
  const { workType } = router.query;

  const categories = WORKTYPE_TO_CATEGORIES[workType];

  const { data, isLoading } = useData(
    inspirationFragments.categories({
      filters: categories.map((c) => ({
        category: c,
        subCategories: CATEGORY_FILTERS[c] || [],
      })),
    })
  );

  return (
    <Page
      data={data?.inspiration?.categories}
      categories={categories}
      isLoading={isLoading}
    />
  );
}

/**
 * These queries are run on the server.
 * I.e. the data fetched will be used for server side rendering
 *

 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */

Wrap.getInitialProps = async (ctx) => {
  const categories = WORKTYPE_TO_CATEGORIES[ctx?.query?.workType];

  // Get subCategories data
  const serverQueries = await fetchAll(
    [inspirationFragments.categories, frontpageHero],
    ctx,
    { categories }
  );

  const subCategories =
    Object.values(serverQueries.initialData)?.[0]?.data?.inspiration
      ?.categories?.[category] || [];

  // Resolve all belt queries
  const beltData = await Promise.all(
    subCategories.map(
      async (sub) =>
        await fetchAll([inspiration], ctx, {
          categories,
          limit: 50,
          filters: [sub.title],
        })
    )
  );

  // Build initialData object
  let initialData = {};
  beltData.forEach(
    (obj) => (initialData = { ...initialData, ...obj.initialData })
  );

  // Merge categories and belt data
  return merge({}, serverQueries, { initialData });
};

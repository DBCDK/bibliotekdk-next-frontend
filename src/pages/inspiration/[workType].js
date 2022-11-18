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
import merge from "lodash/merge";

import { useData } from "@/lib/api/api";
import { inspiration, categories } from "@/lib/api/inspiration.fragments";

import { getCanonicalInspirationUrl } from "@/lib/utils";

import { fetchAll } from "@/lib/api/apiServerOnly";

import { useRouter } from "next/router";

import Header from "@/components/header";
import Section from "@/components/base/section";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";

import Slider from "@/components/inspiration/slider";

// worktype to categories
const WORKTYPE_TO_CATEGORY = {
  artikler: "articles",
  spil: "games",
  bøger: "fiction",
  film: "movies",
  musik: "music",
  noder: "sheetMusic",
};

// worktype to categories
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

export function Page({ category, data, isLoading }) {
  if (isLoading) {
    data = [...new Array(10).fill({ works: [] })];
  }

  const context = "inspiration";

  const title = Translate({ context, label: trim(`title-${category}`) });
  const url = getCanonicalInspirationUrl({ category });
  const description = Translate({
    context,
    label: trim(`description-${category}`),
  });

  return (
    <>
      <Header />
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <Section
        title={<Title type="title3">{title}</Title>}
        backgroundColor={CATEGORY_COLOR[category] || "var(--parchment)"}
        space={{ top: "var(--pt4)", bottom: "var(--pt4)" }}
      >
        {Translate({ context, label: trim(`description-${category}`) })}
      </Section>

      {data?.map((sub, idx) => {
        const backgroundColor =
          idx % 2 == 0 ? null : CATEGORY_COLOR[category] || "var(--parchment)";

        return (
          <Slider
            key={`inspiration-${idx}`}
            title={
              sub.title &&
              Translate({
                context,
                label: trim(`category-${category}-${sub.title}`),
              })
            }
            category={category}
            filters={[sub.title]}
            backgroundColor={backgroundColor}
            divider={{ content: false }}
          />
        );
      })}
    </>
  );
}

export default function Wrap() {
  const router = useRouter();
  const { workType } = router.query;

  const category = WORKTYPE_TO_CATEGORY[workType];

  const { data, isLoading } = useData(
    categories({
      category,
    })
  );

  return (
    <Page
      category={category}
      data={data?.inspiration?.categories?.[category]}
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
  const category = WORKTYPE_TO_CATEGORY[ctx?.query?.workType];

  // Get subCategories data
  const catData = await fetchAll([categories], ctx, {
    category,
  });

  const subCategories =
    Object.values(catData.initialData)?.[0]?.data?.inspiration?.categories?.[
      category
    ] || [];

  // Resolve all belt queries
  const beltData = await Promise.all(
    subCategories.map(
      async (sub) =>
        await fetchAll([inspiration], ctx, {
          category,
          limit: 30,
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
  return merge({}, catData, { initialData });
};

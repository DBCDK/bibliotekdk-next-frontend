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

import { useData } from "@/lib/api/api";
import { inspiration } from "@/lib/api/inspiration.fragments";

import { fetchAll } from "@/lib/api/apiServerOnly";

import { useRouter } from "next/router";

import Header from "@/components/header";
import Section from "@/components/base/section";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import { Slider } from "@/components/inspiration/slider/Slider";

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

  return (
    <>
      <Header />
      <Section
        title={
          <Title type="title3">
            {Translate({ context, label: trim(`title-${category}`) })}
          </Title>
        }
        backgroundColor={CATEGORY_COLOR[category] || "var(--parchment)"}
        space={{ top: "var(--pt4)", bottom: "var(--pt4)" }}
      >
        {""}
      </Section>
      {data?.map((cat, idx) => {
        const backgroundColor =
          idx % 2 == 0 ? null : CATEGORY_COLOR[category] || "var(--parchment)";

        return (
          <Slider
            key={`inspiration-${idx}`}
            title={
              cat.title &&
              Translate({
                context,
                label: trim(`category-${category}-${cat.title}`),
              })
            }
            works={cat?.works}
            isLoading={isLoading}
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
    inspiration({
      limit: 30,
      category,
    })
  );

  const categories = data?.inspiration?.categories;

  return (
    <Page
      category={category}
      data={categories?.[category]}
      isLoading={isLoading}
    />
  );
}

/**
 * These queries are run on the server.
 * I.e. the data fetched will be used for server side rendering
 *
 * Note that the queries must only take variables provided by
 * the dynamic routing - or else requests will fail.
 * On this page, queries should only use:
 *  - category
 */
const serverQueries = [inspiration];

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
Wrap.getInitialProps = (ctx) => {
  const category = WORKTYPE_TO_CATEGORY[ctx?.query?.workType];
  return fetchAll(serverQueries, ctx, { category, limit: 30 });
};

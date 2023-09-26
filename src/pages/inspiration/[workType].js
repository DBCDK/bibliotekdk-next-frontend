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

/**
 * Custom map, settings object
 * - Maps worktype to main category name
 * - Selects specific subCategories
 * - Sorts subCategories
 *
 * http://cat-inspire-1-0.mi-prod.svc.cloud.dbc.dk/
 */

const MAP = {
  artikler: [
    {
      category: "articles",
      subCategories: [
        "nyeste",
        "(30, 39]",
        "(60, 69]",
        "(90, 99]",
        "(70, 79]",
        "(10, 19]",
        "(80, 89]",
        "(50, 59]",
        "(20, 29]",
        "(40, 49]",
        "(0, 9]",
      ],
    },
  ],
  spil: [
    {
      category: "games",
      subCategories: [
        "nyeste",
        "populære",
        "Pc-spil",
        "Playstation 5",
        "Playstation 4",
        "Playstation 3",
        "Nintendo Switch",
        "Wii",
        "Nintendo DS",
        "Xbox One",
        "Xbox 360",
      ],
    },
  ],
  boeger: [
    { category: "fiction", subCategories: ["nyeste", "populære"] },
    { category: "nonfiction", subCategories: ["nyeste", "populære"] },
    { category: "childrenBooksFiction", subCategories: ["nyeste", "populære"] },
    {
      category: "childrenBooksNonfiction",
      subCategories: ["nyeste", "populære"],
    },
    {
      category: "fiction",
      subCategories: [
        "krimi",
        "humor",
        "spænding",
        "biografiske romaner",
        "historiske romaner",
        "science fiction",
        "samfundskritik",
        "eksperimenterende litteratur",
        "politiromaner",
      ],
    },
  ],
  film: [
    {
      category: "movies",
      subCategories: [
        "nyeste",
        "populære",
        "børnematerialer",
        "drama",
        "kærlighed",
        "dokumentarfilm",
        "komedier",
        "tegnefilm",
        "tv-serier",
        "kunst og kunstnere",
        "Film (net)",
        "Dvd",
      ],
    },
  ],
  musik: [
    {
      category: "music",
      subCategories: [
        "nyeste",
        "populære",
        "børnematerialer",
        "klassisk musik 1950 ->",
        "rock",
        "jazz",
        "blues",
        "metal",
        "folk",
        "kammermusik",
        "hip hop",
        "electronica",
        "singer/songwriter",
        "Cd (musik)",
        "Grammofonplade",
        "Dvd",
      ],
    },
  ],
  noder: [
    {
      category: "sheetMusic",
      subCategories: [
        "nyeste",
        "populære",
        "klaverskoler",
        "guitarskoler",
        "sammenspil",
        "undervisningsmaterialer",
        "karaoke",
      ],
    },
  ],
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

export function Page({ data, isLoading }) {
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
        // Hack for removing title but keep section grid
        title={<span />}
        backgroundColor={CATEGORY_COLOR[label] || "var(--white)"}
        space={{ top: "var(--pt4)", bottom: "var(--pt4)" }}
      >
        <div className="inspiration-section-about">
          <Title type="title3" skeleton={isLoading} tag="h1">
            {title}
          </Title>
          <Text type="text2" skeleton={isLoading} lines={2}>
            {Translate({ context, label: trim(`description-${label}`) })}
          </Text>
        </div>
      </Section>

      {data?.map(({ category, subCategories }) =>
        subCategories.map(({ title }, idx) => {
          const backgroundColor =
            count % 2 === 0
              ? null
              : CATEGORY_COLOR[label] || "var(--parchment)";

          count++;

          return (
            <Slider
              key={`inspiration-${title}-${idx}`}
              title={
                title &&
                Translate({
                  context,
                  label: trim(`category-${category}-${title}`),
                })
              }
              category={category}
              filters={[{ category, subCategories: [title] }]}
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

  const filters = MAP[workType];

  const { data, isLoading } = useData(
    inspirationFragments.categories({
      filters,
    })
  );

  return <Page data={data?.inspiration?.categories} isLoading={isLoading} />;
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
  const filters = MAP[ctx?.query?.workType];

  // Get subCategories data
  const serverQueries = await fetchAll(
    [inspirationFragments.categories, frontpageHero],
    ctx,
    { filters }
  );

  const categories = Object.values(serverQueries.initialData)?.[0]?.data
    ?.inspiration?.categories;

  // Resolve all belt queries
  const arr = [];
  categories?.forEach(({ category, subCategories }) =>
    subCategories.forEach(({ title }) =>
      arr.push(
        fetchAll([inspirationFragments.inspiration], ctx, {
          limit: 30,
          filters: [{ category, subCategories: [title] }],
        })
      )
    )
  );

  const beltData = await Promise.all(arr);

  // Build initialData object
  let initialData = {};
  beltData.forEach(
    (obj) => (initialData = { ...initialData, ...obj.initialData })
  );

  // Merge categories and belt data
  return merge({}, serverQueries, { initialData });
};

import { useData } from "@/lib/api/api";
import { inspiration } from "@/lib/api/inspiration.fragments";

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
        backgroundColor="var(--parchment)"
        space={{ top: "var(--pt4)", bottom: "var(--pt4)" }}
      >
        {""}
      </Section>
      {data?.map((cat, idx) => {
        const backgroundColor = idx % 2 == 0 ? null : "var(--parchment)";

        return (
          <Slider
            title={Translate({
              context,
              label: trim(`category-${category}-${cat.title}`),
            })}
            works={cat.works}
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

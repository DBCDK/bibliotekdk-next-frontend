import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateForBigWorkCard } from "@/components/base/materialcard/templates/templates";

import styles from "./SeriesMembers.module.css";

import { getUniqueCreatorsDisplay } from "@/components/series/utils";

// List for removing specific materialTypes if relevant
//  Empty for now
const listOfMaterialTypesToRemove = [];

export function getMemberWorkIds(firstSeriesMembers) {
  return firstSeriesMembers
    ?.filter(
      (member) =>
        !(
          member?.work?.materialTypes?.length === 1 &&
          listOfMaterialTypesToRemove.includes(
            member?.work?.materialTypes?.[0]?.materialTypeSpecific?.code
          )
        )
    )
    ?.map((member) => member?.work?.workId);
}

export default function SeriesMembers({ series, seriesIsLoading }) {
  // skeleton dummy elements
  const dummy = { members: [...new Array(10).fill({})] };

  const firstSeriesMembers = series?.members;
  const firstSeriesFirstWork = firstSeriesMembers?.[0]?.work;
  const firstWorkType = firstSeriesFirstWork?.workTypes?.[0]?.toLowerCase();
  const workTypeTranslation = Translate({
    context: "facets",
    label: `label-${firstWorkType}`,
  });

  const { creators: allCreators } = getUniqueCreatorsDisplay(series);

  const data = seriesIsLoading ? dummy : series;

  return (
    <Section
      title={`${Translate({
        context: "series_page",
        label: "series_members_heading",
        vars: [workTypeTranslation],
      })}`}
      space={{ bottom: "var(--pt0)", top: "var(--pt5)" }}
      divider={{ content: false }}
      isLoading={seriesIsLoading}
    >
      <article className={styles.series_members_results}>
        {data?.members?.map((member) => {
          const work = member?.work;
          return (
            <MaterialCard
              key={work?.workId}
              propAndChildrenTemplate={templateForBigWorkCard}
              propAndChildrenInput={{
                member: member,
                includeCreators: allCreators.length > 1,
                isLoading: seriesIsLoading,
              }}
              isLoading={seriesIsLoading}
            />
          );
        })}
      </article>
    </Section>
  );
}

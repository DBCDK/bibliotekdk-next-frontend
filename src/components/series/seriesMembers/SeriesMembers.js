import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateForBigWorkCard } from "@/components/base/materialcard/templates/templates";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import styles from "./SeriesMembers.module.css";

// Remove BOOK_LARGE_PRINT because they
//  consist of the 25 out of 33 parts in series
//  We might need to figure out what to do with
//  ex. lydbog (cd) for Harry Potter series
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
  const firstSeriesMembers = series?.members;
  const firstSeriesFirstWork = firstSeriesMembers?.[0]?.work;
  const firstWorkType = firstSeriesFirstWork?.workTypes?.[0]?.toLowerCase();
  const workTypeTranslation = Translate({
    context: "facets",
    label: `label-${firstWorkType}`,
  });

  const memberWorkIds = getMemberWorkIds(firstSeriesMembers);

  const { data: worksInSeriesData, isLoading: worksInSeriesIsLoading } =
    useData(
      memberWorkIds && workFragments.worksInSeries({ workIds: memberWorkIds })
    );

  return (
    <Section
      title={`${Translate({
        context: "series_page",
        label: "series_members_heading",
        vars: [workTypeTranslation],
      })}`}
      space={{ bottom: "var(--pt0)", top: "var(--pt5)" }}
      divider={{ content: false }}
      isLoading={seriesIsLoading || worksInSeriesIsLoading}
    >
      <article className={styles.series_members_results}>
        {worksInSeriesData?.works?.map((work) => {
          return (
            <MaterialCard
              key={work?.workId}
              propAndChildrenTemplate={templateForBigWorkCard}
              propAndChildrenInput={work}
            >
              work id: {work?.workId}
            </MaterialCard>
          );
        })}
      </article>
    </Section>
  );
}

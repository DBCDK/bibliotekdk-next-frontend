import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import WorkSlider from "@/components/base/slider/WorkSlider";
import { getMemberWorkIds } from "@/components/series/seriesMembers/SeriesMembers";
import difference from "lodash/difference";
import intersection from "lodash/intersection";
import styles from "./OtherWorksByTheAuthor.module.css";
import cx from "classnames";
import { getUniqueCreatorsDisplay } from "@/components/series/utils";
import * as complexSearchFragments from "@/lib/api/complexSearch.fragments";

const phrase_creatorContributor = "phrase.creatorcontributor";

export function OtherWorksByTheAuthor({
  series,
  seriesIsLoading,
  creator,
  index,
  sectionTitle,
}) {
  const firstSeriesMembers = series?.members;

  const cql = `${phrase_creatorContributor}=\"${creator}\"`;

  const { data: searchData, isLoading: searchIsLoading } = useData(
    creator &&
      complexSearchFragments.complexSearchOnlyWorkIds({
        cql: cql,
        offset: 0,
        limit: 50,
      })
  );
  const searchWorkIds = searchData?.complexSearch?.works?.map(
    (work) => work?.workId
  );
  const memberWorkIds = getMemberWorkIds(firstSeriesMembers);

  // We get searchWorkIds that are not in memberWorkIds
  //  This means we get a list of works that are not already
  //  found in the series
  const nonIntersectingWorkIds = difference(
    searchWorkIds,
    // Intersection finds the ones to filter out
    intersection(searchWorkIds, memberWorkIds)
  );

  const { data: worksInSeriesData, isLoading: worksInSeriesIsLoading } =
    useData(
      nonIntersectingWorkIds &&
        workFragments.worksInSeries({
          workIds: nonIntersectingWorkIds.slice(0, 20),
        })
    );

  if (worksInSeriesData?.works?.length === 0) {
    return null;
  }

  return (
    worksInSeriesData?.works && (
      <Section
        title={sectionTitle}
        divider={false}
        space={{ bottom: "var(--pt0)", top: "var(--pt4)" }}
        className={cx(styles.section_color, {
          [styles.section_first]: index === 0,
        })}
        isLoading={seriesIsLoading}
      >
        <WorkSlider
          skeleton={
            seriesIsLoading || worksInSeriesIsLoading || searchIsLoading
          }
          propsAndChildrenInputList={worksInSeriesData?.works?.map((work) => {
            return {
              material: work,
            };
          })}
        />
      </Section>
    )
  );
}

export default function Wrap({ series, seriesIsLoading }) {
  const { creators: uniqueCreatorsDisplay } = getUniqueCreatorsDisplay(series);

  const firstSeriesFirstWork = series?.members?.[0]?.work;
  const firstWorkType = firstSeriesFirstWork?.workTypes?.[0]?.toLowerCase();
  const workTypeTranslation = Translate({
    context: "facets",
    label: `label-${firstWorkType}`,
  }).toLowerCase();

  return uniqueCreatorsDisplay.slice(0, 1).map((creator, index) => {
    const sectionTitle = `${Translate({
      context: "series_page",
      label: "other_works_by_the_author",
      vars: [workTypeTranslation],
    })} ${creator}`;

    return (
      <OtherWorksByTheAuthor
        key={index}
        series={series}
        seriesIsLoading={seriesIsLoading}
        firstSection={true}
        creator={creator}
        index={index}
        sectionTitle={sectionTitle}
      />
    );
  });
}

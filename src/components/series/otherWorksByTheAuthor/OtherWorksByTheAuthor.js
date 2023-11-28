import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import WorkSlider from "@/components/base/slider/WorkSlider";
import * as searchFragments from "@/lib/api/search.fragments";
import { getMemberWorkIds } from "@/components/series/seriesMembers/SeriesMembers";
import difference from "lodash/difference";
import intersection from "lodash/intersection";
import styles from "./OtherWorksByTheAuthor.module.css";
import cx from "classnames";
import { getUniqueCreatorsDisplay } from "@/components/series/utils";

export function OtherWorksByTheAuthor({ series, seriesIsLoading, creator }) {
  const firstSeriesMembers = series?.members;

  const { data: searchData, isLoading: searchIsLoading } = useData(
    creator &&
      searchFragments.all({
        q: {
          creator: creator,
        },
        search_exact: true,
      })
  );
  const searchWorkIds = searchData?.search?.works?.map((work) => work?.workId);
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

  return (
    worksInSeriesData?.works && (
      <WorkSlider
        skeleton={seriesIsLoading || worksInSeriesIsLoading || searchIsLoading}
        propsAndChildrenInputList={worksInSeriesData?.works?.map((work) => {
          return {
            material: work,
          };
        })}
      />
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
    return (
      <Section
        key={creator}
        title={`${Translate({
          context: "series_page",
          label: "other_works_by_the_author",
          vars: [workTypeTranslation],
        })} ${creator}`}
        divider={false}
        space={{ bottom: "var(--pt0)", top: "var(--pt4)" }}
        className={cx(styles.section_color, {
          [styles.section_first]: index === 0,
        })}
        isLoading={seriesIsLoading}
      >
        <OtherWorksByTheAuthor
          series={series}
          seriesIsLoading={seriesIsLoading}
          firstSection={true}
          creator={creator}
        />
      </Section>
    );
  });
}

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import WorkSlider from "@/components/base/slider/WorkSlider";
import * as searchFragments from "@/lib/api/search.fragments";
import { getMemberWorkIds } from "@/components/series/seriesMembers/SeriesMembers";
import difference from "lodash/difference";
import intersection from "lodash/intersection";

export default function OtherWorksByTheAuthor({ series }) {
  const firstSeriesFirstWork = series?.[0]?.members?.[0]?.work;
  const firstSeriesMembers = series?.[0]?.members;
  const firstWorkType = firstSeriesFirstWork?.workTypes?.[0]?.toLowerCase();
  const workTypeTranslation = Translate({
    context: "facets",
    label: `label-${firstWorkType}`,
  }).toLowerCase();

  const firstCreator = firstSeriesFirstWork?.creators?.[0];

  const { data: searchData, isLoading: searchIsLoading } = useData(
    firstCreator &&
      searchFragments.all({
        q: {
          creator: firstCreator.display,
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
    <Section
      title={`${Translate({
        context: "series_page",
        label: "other_works_by_the_author",
        vars: [workTypeTranslation],
      })} ${firstSeriesFirstWork?.creators?.[0]?.display}`}
      divider={{ content: false }}
      space={{ bottom: "var(--pt0)", top: "var(--pt10)" }}
      isLoading={searchIsLoading}
    >
      {worksInSeriesData?.works && (
        <WorkSlider
          skeleton={worksInSeriesIsLoading}
          works={worksInSeriesData?.works}
        />
      )}
    </Section>
  );
}

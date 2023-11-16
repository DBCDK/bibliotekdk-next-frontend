import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import SeriesHeading from "@/components/series/seriesHeading/SeriesHeading";
import OtherWorksByTheAuthor from "@/components/series/otherWorksByTheAuthor/OtherWorksByTheAuthor";
import SeriesMembers from "@/components/series/seriesMembers/SeriesMembers";
import Custom404 from "@/pages/404";
import isArray from "lodash/isArray";
import { useEffect } from "react";
import uniq from "lodash/uniq";

export function getUniqueCreatorsDisplay(series) {
  return uniq(
    series?.members?.flatMap((member) =>
      member?.work?.creators?.map((creator) => creator?.display)
    )
  );
}

export default function SeriesPage() {
  const router = useRouter();

  const { workId, seriesNumber: seriesNumberAsString } = router.query;

  const seriesNumber = parseInt(
    isArray(seriesNumberAsString)
      ? seriesNumberAsString?.[0]
      : seriesNumberAsString
  );

  const {
    data: seriesData,
    isLoading: seriesIsLoading,
    error: seriesError,
  } = useData(workId && workFragments.series({ workId: workId }));

  useEffect(() => {
    const chosenSeries = seriesData?.work?.series?.[seriesNumber];

    if (!seriesIsLoading && (!chosenSeries || chosenSeries?.length === 0)) {
      if (seriesNumber === 0) {
        router?.replace(`/work/${workId}`);
      }

      router?.replace({
        pathname: router.pathname,
        query: { ...router.query, seriesNumber: 0 },
      });
    }
  }, [
    seriesIsLoading,
    seriesNumber,
    seriesData?.work?.series?.[seriesNumber]?.length,
  ]);

  const series = seriesData?.work?.series;
  const specificSeries = series?.[seriesNumber];

  if (seriesError) {
    return <Custom404 />;
  }

  return (
    <>
      <Header router={router} />
      <SeriesHeading
        series={specificSeries}
        seriesIsLoading={seriesIsLoading}
      />
      <SeriesMembers
        series={specificSeries}
        seriesIsLoading={seriesIsLoading}
      />
      <OtherWorksByTheAuthor
        series={specificSeries}
        seriesIsLoading={seriesIsLoading}
      />
    </>
  );
}

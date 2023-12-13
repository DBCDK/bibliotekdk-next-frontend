import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import SeriesHeading from "@/components/series/seriesHeading/SeriesHeading";
import OtherWorksByTheAuthor from "@/components/series/otherWorksByTheAuthor/OtherWorksByTheAuthor";
import SeriesMembers from "@/components/series/seriesMembers/SeriesMembers";
import Custom404 from "@/pages/404";
import { useEffect } from "react";
import { encodeString } from "@/lib/utils";

export default function SeriesPage() {
  const router = useRouter();

  const { workId, seriesTitle } = router.query;

  const {
    data: seriesData,
    isLoading: seriesIsLoading,
    error: seriesError,
  } = useData(workId && workFragments.series({ workId: workId }));

  // const seriesIsLoading = true;

  const series = seriesData?.work?.series;
  const specificSeries = series?.find(
    (singleSeries) => encodeString(singleSeries.title) === seriesTitle
  );

  useEffect(() => {
    if (series?.length === 0) {
      router?.replace(`/work/${workId}`);
    }

    if (
      !seriesIsLoading &&
      series?.length > 0 &&
      (!specificSeries || specificSeries?.length === 0)
    ) {
      router?.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          seriesTitle: encodeString(series?.[0]?.title),
        },
      });
    }
  }, [seriesIsLoading, seriesTitle, JSON.stringify(series)]);

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

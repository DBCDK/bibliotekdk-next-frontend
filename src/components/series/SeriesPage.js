import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import SeriesHeading from "@/components/series/seriesHeading/SeriesHeading";
import OtherWorksByTheAuthor from "@/components/series/otherWorksByTheAuthor/OtherWorksByTheAuthor";
import SeriesMembers from "@/components/series/seriesMembers/SeriesMembers";
import Custom404 from "@/pages/404";
import { ContentSkeleton } from "@/components/work/content/Content";

export default function SeriesPage() {
  const router = useRouter();
  const { workId } = router.query;

  const {
    data: seriesData,
    isLoading: seriesIsLoading,
    error: seriesError,
  } = useData(workId && workFragments.series({ workId: workId }));

  const series = seriesData?.work?.series;

  if (seriesError) {
    return <Custom404 />;
  }

  return (
    <>
      <Header router={router} />
      {seriesIsLoading ? (
        <ContentSkeleton />
      ) : (
        <>
          <SeriesHeading series={series} />
          <SeriesMembers series={series} />
          <OtherWorksByTheAuthor series={series} />
        </>
      )}
    </>
  );
}
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
import Head from "next/head";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";

export default function SeriesPage() {
  const router = useRouter();
  const { canonical, alternate } = useCanonicalUrl();

  const { workId, seriesTitle } = router.query;

  const {
    data: seriesData,
    isLoading: seriesIsLoading,
    error: seriesError,
  } = useData(
    workId && workFragments.series({ workId: workId, seriesLimit: 200 })
  );

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

  const description = seriesData?.work?.series?.[0]?.description;
  const title = seriesData?.work?.series?.[0]?.title;

  return (
    <>
      <Head>
        <title key="title">{title}</title>
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

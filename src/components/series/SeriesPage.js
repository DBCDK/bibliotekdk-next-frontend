import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import SeriesHeading from "@/components/series/seriesHeading/SeriesHeading";
import OtherWorksByTheAuthor from "@/components/series/otherWorksByTheAuthor/OtherWorksByTheAuthor";
import SeriesMembers from "@/components/series/seriesMembers/SeriesMembers";
import Custom404 from "@/pages/404";
import Head from "next/head";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import { getJSONLD } from "@/lib/jsonld/series";

export default function SeriesPage() {
  const router = useRouter();
  const { canonical, alternate } = useCanonicalUrl();

  const { seriesId } = router.query;

  const {
    data: seriesData,
    isLoading: seriesIsLoading,
    error: seriesError,
  } = useData(
    seriesId && workFragments.seriesById({ seriesId: seriesId, seriesLimit: 0 })
  );
  const jsonld = seriesData && getJSONLD(seriesData);
  const specificSeries = seriesData?.series;
  if (seriesError) {
    return <Custom404 />;
  }

  const imgUrl = jsonld?.image;

  const description =
    seriesData?.series?.description ||
    seriesData?.work?.series?.[0]?.description;
  const title =
    seriesData?.series?.title || seriesData?.work?.series?.[0]?.title;

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
        {imgUrl && (
          <meta key="og:image" property="og:image" content={`${imgUrl}`} />
        )}
        {alternate.map(({ locale, url }) => (
          <link key={locale} rel="alternate" hreflang={locale} href={url} />
        ))}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonld),
          }}
        />
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

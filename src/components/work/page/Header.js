/**
 * @file The header section of the work page
 *
 * We embed a JSON-LD representation of the work
 * - https://developers.google.com/search/docs/data-types/book
 * - https://solsort.dk/dkabm-til-schema.org
 *
 * And we embed Open Graph as RDFa
 */
import PropTypes from "prop-types";
import Head from "next/head";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import { getJSONLD } from "@/lib/jsonld/work";
import { getCanonicalWorkUrl } from "@/lib/utils";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import { getSeo } from "@/components/work/utils";
import { getCoverImage } from "@/components/utils/getCoverImage";

/**
 * The work page React component
 *
 * @param  {Object} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Header({ details }) {
  const { alternate } = useCanonicalUrl();

  if (!details.data || details.isLoading || details.error) {
    return null;
  }
  const data = details.data;
  /*
  this on is tricky - JSONLD uses many fields - see work.js/getJSONLD(work)
  articles:
  id,
  title,
  description,
  creators = [],
  manifestations = [],
  url
   */
  const jsonld = getJSONLD(data.work);
  /* there is no SEO in fbi-api */
  const seo = getSeo(data.work);
  const pageDescription = seo.description;
  const pageTitle = seo.title;

  /** get coverUrl **/
  const coverUrl = getCoverImage(data?.work?.manifestations?.all).detail;

  /**
   * NOTE - first creator[0], title, workid - in paramters for getCanonicalWorkUrl
   */

  /* title, creators, id*/
  const urlWork = {
    title: data.work?.titles?.main[0],
    creators: data.work?.creators,
    id: data.work?.workId,
  };
  const canonicalWorkUrl = getCanonicalWorkUrl({ ...urlWork });

  return (
    <Head>
      <title key="title">{pageTitle}</title>
      <meta
        key="description"
        name="description"
        content={pageDescription}
      ></meta>
      <meta key="og:url" property="og:url" content={canonicalWorkUrl} />
      <meta key="og:title" property="og:title" content={pageTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={pageDescription}
      />
      {coverUrl && (
        <meta key="og:image" property="og:image" content={coverUrl} />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonld),
        }}
      />
      {alternate.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hreflang={locale} href={url} />
      ))}
      <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
    </Head>
  );
}

/*
NOTES
pageDescription
canonicalWorkUrl
pageTitle
pageDescription
cover
 */

export default function Wrap({ workId }) {
  const details = useData(workFragments.workJsonLd({ workId }));
  return <Header details={details} />;
}

Wrap.propTypes = {
  workId: PropTypes.string,
};

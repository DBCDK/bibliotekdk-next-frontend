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
import Head from "@/components/head";
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
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
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
    <Head
      title={pageTitle}
      description={pageDescription}
      image={coverUrl}
      canonical={canonicalWorkUrl}
      alternate={alternate}
      jsonLd={jsonld}
    />
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

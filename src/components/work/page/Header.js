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
import merge from "lodash/merge";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import { getJSONLD } from "@/lib/jsonld/work";
import { getCanonicalWorkUrl } from "@/lib/utils";
import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";

/**
 * The work page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Header({ workId }) {
  const details = useData(workFragments.detailsAllManifestations({ workId }));
  const { alternate } = useCanonicalUrl();

  if (!details.data || details.isLoading || details.error) {
    return null;
  }
  const data = details.data;
  const jsonld = getJSONLD(data.work);
  const pageDescription = data.work.seo.description;
  const pageTitle = data.work.seo.title;

  const canonicalWorkUrl = getCanonicalWorkUrl(data.work);

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription}></meta>
      <meta property="og:url" content={canonicalWorkUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {data.work.cover && (
        <meta property="og:image" content={data.work.cover.detail} />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonld),
        }}
      />
      {alternate.map(({ locale, url }) => (
        <link key={url} rel="alternate" hreflang={locale} href={url} />
      ))}
      <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
    </Head>
  );
}

Header.propTypes = {
  workId: PropTypes.string,
};

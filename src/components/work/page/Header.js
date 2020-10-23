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
import { useData } from "../../../lib/api/api";
import * as workFragments from "../../../lib/api/work.fragments";

import { getJSONLD } from "../../../lib/jsonld";
import { getPageDescription, getCanonicalWorkUrl } from "../../../lib/utils";

/**
 * The work page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Header({ workId }) {
  const { data, isLoading, error } = useData(workFragments.basic({ workId }));
  if (!data || isLoading || error) {
    return null;
  }
  const jsonld = getJSONLD(data.work);
  const pageDescription = getPageDescription(data.work);
  // We should have a "primary cover" on the work
  // so we don't have to do this
  let cover;
  data.work.materialTypes.forEach((materialType) => {
    if (materialType.cover) {
      cover = materialType.cover;
    }
  });

  return (
    <Head>
      <title>{`${data.work.title} - ${
        data.work.creators[0] && data.work.creators[0].name
      }`}</title>
      <meta name="description" content={pageDescription}></meta>
      <meta
        property="og:url"
        content={getCanonicalWorkUrl({ ...data.work, id: workId })}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={data.work.title} />
      <meta property="og:description" content={pageDescription} />
      {cover && <meta property="og:image" content={cover.detail} />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonld),
        }}
      />
      <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
    </Head>
  );
}

Header.propTypes = {
  workId: PropTypes.string,
};

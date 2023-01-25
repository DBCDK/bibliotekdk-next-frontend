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
import { helpText } from "@/lib/api/helptexts.fragments.js";

import { getJSONLD } from "@/lib/jsonld/help";
import { getCanonicalArticleUrl } from "@/lib/utils";

import Translate from "@/components/base/translate";

/**
 * The article page Header React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Header({ helpTextId }) {
  const { isLoading, data, error } = useData(
    helpTextId && helpText({ helpTextId: helpTextId })
  );

  if (!data || !data.nodeById || isLoading || error) {
    // @TODO some error here .. message for user .. log ??
    return null;
  }

  const context = { context: "metadata" };

  const helptext = data.nodeById;

  const pageTitle = Translate({
    ...context,
    label: "help-article-title",
    vars: [helptext.title],
  });

  const pageDescription = Translate({
    ...context,
    label: "help-description",
  });

  return (
    <Head>
      <title key="title">{pageTitle}</title>
      <meta
        key="description"
        name="description"
        content={pageDescription}
      ></meta>
      <meta
        key="og:url"
        property="og:url"
        content={getCanonicalArticleUrl(helptext)}
      />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={pageTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={pageDescription}
      />
      {helptext.fieldImage?.url && (
        <meta
          key="og:image"
          property="og:image"
          content={`/_next/image?url=${helptext.fieldImage?.url}&w=1920&q=75`}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJSONLD(helptext)),
        }}
      />
      <link
        rel="preconnect"
        href="http://bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk"
      ></link>
    </Head>
  );
}

Header.propTypes = {
  helpTextId: PropTypes.string,
};

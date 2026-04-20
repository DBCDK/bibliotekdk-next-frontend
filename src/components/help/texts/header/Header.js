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
import { helpText } from "@/lib/api/helptexts.fragments.js";

import { getJSONLD } from "@/lib/jsonld/help";
import { getCanonicalArticleUrl } from "@/lib/utils";

import Translate from "@/components/base/translate";

/**
 * The article page Header React component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Header({ helpTextId }) {
  const { isLoading, data, error } = useData(
    helpTextId && helpText({ helpTextId: helpTextId })
  );

  if (!data || !data.bibliotekdkCms?.helpText || isLoading || error) {
    return null;
  }

  const context = { context: "metadata" };

  const helptext = data.bibliotekdkCms.helpText;

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
    <Head
      title={pageTitle}
      description={pageDescription}
      image={
        helptext.image?.url
          ? `/_next/image?url=${helptext.image?.url}&w=1920&q=75`
          : undefined
      }
      canonical={getCanonicalArticleUrl(helptext)}
      jsonLd={getJSONLD(helptext)}
      preconnect={[
        "https://moreinfo.addi.dk",
        "http://bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk",
      ]}
    />
  );
}

Header.propTypes = {
  helpTextId: PropTypes.string,
};

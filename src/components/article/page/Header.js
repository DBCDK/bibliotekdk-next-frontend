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
import * as articleFragments from "@/lib/api/article.fragments";

import { getJSONLD } from "@/lib/jsonld/article";
import { getCanonicalArticleUrl } from "@/lib/utils";

import { getLanguage } from "@/components/base/translate";

/**
 * The article page Header React component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Header({ articleId }) {
  const language = getLanguage();
  const data = useData(articleFragments.article({ articleId, language }));

  if (!data.data || !data.data.article || data.isLoading || data.error) {
    return null;
  }

  const article = data.data.article;
  return (
    <Head
      title={article.title}
      description={article.fieldRubrik}
      image={
        article.fieldImage?.url
          ? `/_next/image?url=${article.fieldImage.url}&w=1920&q=75`
          : undefined
      }
      canonical={getCanonicalArticleUrl(article)}
      jsonLd={getJSONLD(article)}
      preconnect={[
        "https://moreinfo.addi.dk",
        "http://bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk",
      ]}
    />
  );
}

Header.propTypes = {
  articleId: PropTypes.string,
};

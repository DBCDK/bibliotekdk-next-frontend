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

import { getJSONLD } from "@/lib/jsonld/article";
import { getCanonicalArticleUrl } from "@/lib/utils";

import { getLanguage } from "@/components/base/translate";
import { getArticleById } from "@/local-data/cms/resolvers";

/**
 * The article page Header React component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Header({ articleId }) {
  const article = getArticleById(articleId, getLanguage());

  if (!article) {
    return null;
  }

  return (
    <Head>
      <title key="title">{article.title}</title>
      <meta
        key="description"
        name="description"
        content={article.fieldRubrik}
      ></meta>
      <meta
        key="og:url"
        property="og:url"
        content={getCanonicalArticleUrl(article)}
      />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={article.title} />
      <meta
        key="og:description"
        property="og:description"
        content={article.fieldRubrik}
      />
      {article.fieldImage && article.fieldImage.url && (
        <meta
          key="og:image"
          property="og:image"
          content={`/_next/image?url=${article.fieldImage.url}&w=1920&q=75`}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJSONLD(article)),
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
  articleId: PropTypes.string,
};

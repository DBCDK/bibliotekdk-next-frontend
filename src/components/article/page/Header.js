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
import * as articleFragments from "@/lib/api/article.fragments";

import { getJSONLD } from "@/lib/jsonld/article";
import { getCanonicalArticleUrl } from "@/lib/utils";
import { getLangcode } from "@/components/base/translate/Translate";

/**
 * The article page Header React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Header({ articleId }) {
  const language = getLangcode();
  const data = useData(articleFragments.article({ articleId, language }));

  if (!data.data || !data.data.article || data.isLoading || data.error) {
    return null;
  }

  const article = data.data.article;

  return (
    <Head>
      <title>{article.title}</title>
      <meta name="description" content={article.title}></meta>
      <meta property="og:url" content={getCanonicalArticleUrl(article)} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.fieldRubrik} />
      {article.fieldImage && article.fieldImage.url && (
        <meta property="og:image" content={article.fieldImage.url} />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJSONLD(article)),
        }}
      />
      <link
        rel="preconnect"
        href="http://bibdk-backend-www-master.frontend-prod.svc.cloud.dbc.dk"
      ></link>
    </Head>
  );
}

Header.propTypes = {
  articleId: PropTypes.string,
};

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
import useSiteConfig from "@/components/hooks/useSiteConfig";

/**
 * The article page Header React component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Header({ helpTextId }) {
  const { buildMetadata } = useSiteConfig();
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
  const metadata = buildMetadata({
    title: pageTitle,
    description: pageDescription,
    image: helptext.fieldImage?.url
      ? `/_next/image?url=${helptext.fieldImage?.url}&w=1920&q=75`
      : undefined,
  });

  return (
    <Head>
      <title key="title">{metadata.title}</title>
      <meta
        key="description"
        name="description"
        content={metadata.description}
      ></meta>
      <meta
        key="og:url"
        property="og:url"
        content={getCanonicalArticleUrl(helptext)}
      />
      <meta key="og:type" property="og:type" content={metadata.openGraphType} />
      <meta key="og:title" property="og:title" content={metadata.title} />
      <meta
        key="og:site_name"
        property="og:site_name"
        content={metadata.siteName}
      />
      <meta
        key="og:description"
        property="og:description"
        content={metadata.description}
      />
      <meta key="og:image" property="og:image" content={metadata.image} />
      <meta name="referrer" content={metadata.referrer} />
      <meta
        name="mobile-web-app-capable"
        content={metadata.mobileWebAppCapable}
      ></meta>
      <meta name="theme-color" content={metadata.themeColor}></meta>

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

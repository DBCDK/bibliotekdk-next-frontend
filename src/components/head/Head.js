import NextHead from "next/head";
import PropTypes from "prop-types";

import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import useSiteConfig from "@/components/hooks/useSiteConfig";

import Translate from "@/components/base/translate";

export default function Head({
  title,
  description,
  image,
  canonical,
  alternate,
  jsonLd,
  children,
  preconnect,
}) {
  const context = { context: "metadata" };
  const { buildMetadata } = useSiteConfig();

  const defaultTitle = Translate({
    ...context,
    label: "frontpage-title",
    vars: ["bibliotek.dk"],
  });
  const defaultDescription = Translate({
    ...context,
    label: "frontpage-description",
  });

  const { canonical: defaultCanonical, alternate: defaultAlternate } =
    useCanonicalUrl();

  const metadata = buildMetadata({
    title: title || defaultTitle,
    description: description || defaultDescription,
    image,
  });
  const canonicalUrl = canonical || defaultCanonical?.url;
  const alternateLinks = alternate || defaultAlternate;
  const preconnectUrls = preconnect || ["https://moreinfo.addi.dk"];

  return (
    <NextHead>
      <title key="title">{metadata.title}</title>
      <meta
        key="description"
        name="description"
        content={metadata.description}
      ></meta>
      {canonicalUrl && (
        <meta key="og:url" property="og:url" content={canonicalUrl} />
      )}
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

      {preconnectUrls.map((href) => (
        <link key={href} rel="preconnect" href={href}></link>
      ))}
      <link
        rel="icon"
        href={metadata.faviconSvg}
        sizes="any"
        type="image/svg+xml"
      />
      <link rel="alternate icon" href={metadata.faviconIco} />
      {alternateLinks.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hreflang={locale} href={url} />
      ))}

      <meta
        name="mobile-web-app-capable"
        content={metadata.mobileWebAppCapable}
      ></meta>
      <meta name="theme-color" content={metadata.themeColor}></meta>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
      {children}
    </NextHead>
  );
}

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  canonical: PropTypes.string,
  alternate: PropTypes.array,
  jsonLd: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.node,
  preconnect: PropTypes.arrayOf(PropTypes.string),
};

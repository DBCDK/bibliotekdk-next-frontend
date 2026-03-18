import NextHead from "next/head";

import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import useSiteConfig from "@/components/hooks/useSiteConfig";

import Translate from "@/components/base/translate";

export default function Head() {
    const context = { context: "metadata" };
  const { site, buildMetadata } = useSiteConfig();



  const pageTitle = Translate({ ...context, label: "frontpage-title", vars: ["bibliotek.dk"] });
  const pageDescription = Translate({
    ...context,
    label: "frontpage-description",
  });

  const { canonical, alternate } = useCanonicalUrl();

  const metadata = buildMetadata({
    title: pageTitle,
    description: pageDescription,
  });

  console.log("### metadata", metadata);

  return (
    <NextHead>
      <title key="title">{metadata.title}</title>
      <meta
        key="description"
        name="description"
        content={metadata.description}
      ></meta>
      <meta key="og:url" property="og:url" content={canonical.url} />
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

      <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
      <link
        rel="icon"
        href={metadata.faviconSvg}
        sizes="any"
        type="image/svg+xml"
      />
      <link rel="alternate icon" href={metadata.faviconIco} />
      {alternate.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hreflang={locale} href={url} />
      ))}

      <meta
        name="mobile-web-app-capable"
        content={metadata.mobileWebAppCapable}
      ></meta>
      <meta name="theme-color" content={metadata.themeColor}></meta>
    </NextHead>
  );
}

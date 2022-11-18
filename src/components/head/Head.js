import Head from "next/head";

import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";
import { frontpageHero } from "@/lib/api/hero.fragments";
import { useData } from "@/lib/api/api";
import { parseHero } from "@/components/hero/Hero";

import Translate from "@/components/base/translate";

export default function DefaultHead() {
  const context = { context: "metadata" };
  const pageTitle = Translate({ ...context, label: "frontpage-title" });
  const pageDescription = Translate({
    ...context,
    label: "frontpage-description",
  });

  const { data } = useData(frontpageHero());
  const ogImage = parseHero(data);
  const { canonical, alternate } = useCanonicalUrl();

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription}></meta>
      <meta property="og:url" content={canonical.url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {ogImage && ogImage.image && ogImage.image.ogurl && (
        <meta property="og:image" content={`${ogImage?.image?.ogurl}`} />
      )}
      <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
      <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      <link rel="alternate icon" href="/favicon.ico" />
      {alternate.map(({ locale, url }) => (
        <link key={url} rel="alternate" hreflang={locale} href={url} />
      ))}

      <meta name="mobile-web-app-capable" content="yes"></meta>
      <meta name="theme-color" content="#3333ff"></meta>
    </Head>
  );
}

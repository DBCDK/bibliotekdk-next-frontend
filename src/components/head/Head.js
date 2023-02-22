import Head from "next/head";

import useCanonicalUrl from "@/components/hooks/useCanonicalUrl";

import Translate from "@/components/base/translate";

export default function _Head() {
  const context = { context: "metadata" };
  const pageTitle = Translate({ ...context, label: "frontpage-title" });
  const pageDescription = Translate({
    ...context,
    label: "frontpage-description",
  });

  const { canonical, alternate } = useCanonicalUrl();

  return (
    <Head>
      {/* <script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="0fbb22bb-3956-42c3-bf83-d7551c5f70d2"
        data-blockingmode="auto"
        type="text/javascript"
      ></script> */}
      <script
        id="teststat"
        src="/test-statistics-script.js"
        type="text/javascript"
      ></script>
      <title key="title">{pageTitle}</title>
      <meta
        key="description"
        name="description"
        content={pageDescription}
      ></meta>
      <meta key="og:url" property="og:url" content={canonical.url} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={pageTitle} />
      <meta
        key="og:description"
        property="og:description"
        content={pageDescription}
      />
      <meta
        key="og:image"
        property="og:image"
        content={"/img/bibdk-default-img.png"}
      />
      <link rel="preconnect" href="https://moreinfo.addi.dk"></link>
      <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      <link rel="alternate icon" href="/favicon.ico" />
      {alternate.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hreflang={locale} href={url} />
      ))}

      <meta name="mobile-web-app-capable" content="yes"></meta>
      <meta name="theme-color" content="#3333ff"></meta>
    </Head>
  );
}

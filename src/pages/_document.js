import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import getConfig from "next/config";
import { normalizeSite } from "@/components/hooks/useSiteConfig";

const COOKIEBOT = getConfig()?.publicRuntimeConfig?.cookiebot;
const SITE = normalizeSite(getConfig()?.publicRuntimeConfig?.app?.site);

// Cookiebot script added to _document.js def template as recommended by the docs
// https://nextjs.org/docs/api-reference/next/script#strategy

export default function Document() {
  return (
    <Html data-site={SITE}>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.eu/uc.js"
          data-cbid={COOKIEBOT.id}
          type="text/javascript"
          strategy="beforeInteractive"
          async
        />
      </body>
    </Html>
  );
}

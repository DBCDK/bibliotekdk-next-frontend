import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import getConfig from "next/config";

const COOKIEBOT = getConfig()?.publicRuntimeConfig?.cookiebot;

// Cookiebot script added to _document.js def template as recommended by the docs
// https://nextjs.org/docs/api-reference/next/script#strategy

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.eu/uc.js"
          data-cbid={COOKIEBOT.id}
          data-blockingmode={COOKIEBOT.mode}
          type="text/javascript"
          strategy="beforeInteractive"
          async={!COOKIEBOT.mode === "auto"}
        />
      </body>
    </Html>
  );
}

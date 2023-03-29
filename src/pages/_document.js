import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import getConfig from "next/config";

const COOKIEBOT = getConfig()?.publicRuntimeConfig?.cookiebot;

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
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

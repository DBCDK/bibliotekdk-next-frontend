import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          id="Cookiebot"
          type="text/javascript"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="0945225b-6b16-4166-82dd-ea5947b897b3"
          data-blockingmode="auto"
          async="async"
        ></script>

        <script
          id="MatomoConnect"
          type="text/javascript"
          src="/matomo-connect.js"
        ></script>

        <script
          id="MatomoScript"
          type="text/javascript"
          src="/matomo-script.js"
        ></script>

        <script
          id="Teststatistics"
          // type="text/plain"
          type="text/javascript"
          src="/test-statistics-script.js"
          // data-cookieconsent="statistics"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

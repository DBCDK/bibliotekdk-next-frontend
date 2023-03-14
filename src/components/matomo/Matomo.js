import Head from "next/head";

export default function Matomo() {
  return (
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  (function() {
  var u="https://stats.dbc.dk/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '33']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();`,
        }}
      />
    </Head>
  );
}

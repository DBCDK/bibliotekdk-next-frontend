/**
 * @file
 * This is the configuration file for Next.js.
 *
 * See https://nextjs.org/docs/api-reference/next.config.js/introduction
 *
 * We set distDir, such that the build folder is located next to the storybook build
 */

//     {
//       source: "/_next/image:slug*",
//       headers: [
//         {
//           key: "Cache-Control",
//           value: "public, s-maxage=600",
//         },
//       ],
//     },
//     {
//       source: "/img:slug*",
//       headers: [
//         {
//           key: "Cache-Control",
//           value: "public, s-maxage=600",
//         },
//       ],
//     },

const headers = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; " +
      "script-src 'self' *.dbc.dk https://consent.cookiebot.eu https://consentcdn.cookiebot.eu 'unsafe-eval' 'unsafe-inline' http://localhost:*; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' blob: https://moreinfo.addi.dk img.sct.eu1.usercentrics.eu data: *.dbc.dk http://localhost:*; " +
      "connect-src 'self' https://consentcdn.cookiebot.eu https://consent.cookiebot.eu https://stats.dbc.dk *.dbc.dk https://samples.pubhub.dk https://samples.qa.pubhub.dk https://*.wedobooks.io http://localhost:* ws://localhost:*; " +
      "frame-src 'self' *.dbc.dk https://consentcdn.cookiebot.eu; " +
      "font-src 'self' data:; " +
      "worker-src 'self' blob:; ",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

module.exports = {
  productionBrowserSourceMaps: true, // will be removed again when we have found and fixed bugs
  distDir: "dist/next",
  headers: async () => {
    return [
      {
        source: "/_next/static/:path*.map", //Can be removed if productionBrowserSourceMaps is false
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)", //all pages
        headers,
      },
      {
        source: "/", //frontpage. For some reason frontpage is not included in the above path
        headers,
      },
    ];
  },
  i18n: {
    locales: ["da", "en"],
    defaultLocale: "da",
    localeDetection: false,
  },
  images: {
    domains: [
      "forfatterweb.dk",
      "bibdk-backend-www-master.febib-prod.svc.cloud.dbc.dk",
      "bibdk-backend-www-master.febib-staging.svc.cloud.dbc.dk",
      "bibdk-backend-www-master.frontend-staging.svc.cloud.dbc.dk",
    ],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 640, 1400],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/hj%C3%A6lp",
        destination: "/hjaelp",
        permanent: true,
      },
      {
        source: "/help",
        destination: "/hjaelp",
        permanent: true,
      },
      {
        source: "/inspiration/b%C3%B8ger",
        destination: "/inspiration/boeger",
        permanent: true,
      },
      {
        source: "/inspiration/bøger",
        destination: "/inspiration/boeger",
        permanent: true,
      },
      {
        source: "/was",
        destination: "https://www.was.digst.dk/beta-bibliotek-dk",
        permanent: false,
      },
      {
        source: "/work/((?!work-of)):workId",
        destination: "/materiale/titel_skaber/work-of%3A:workId",
        permanent: true,
      },
      {
        source: "/work/work-of:workId",
        destination: "/materiale/titel_skaber/work-of:workId",
        permanent: true,
      },
      {
        source: "/work/pid/:pid",
        destination: "/linkme.php/?rec.id=:pid",
        permanent: true,
      },
    ];
  },
  experimental: {
    scrollRestoration: true,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    jwtSecret: process.env.NEXTAUTH_SECRET,
    disableDrupalTranslate: process.env.DISABLE_DRUPAL_TRANSLATE || false,
    maxError500Count: process.env.MAX_ERROR_COUNT || 2,
    allowRobots: process.env.ALLOW_ROBOTS === "true" ? true : false,
  },
  publicRuntimeConfig: {
    fbi_api_force_profile: process.env.FBI_API_FORCE_PROFILE,
    cookiebot: {
      id: process.env.COOKIEBOT_ID || "0945225b-6b16-4166-82dd-ea5947b897b3",
      mode: process.env.COOKIEBOT_MODE || "auto",
    },
    elbaDryRun:
      typeof process.env.ELBA_DRY_RUN === "undefined"
        ? true
        : process.env.ELBA_DRY_RUN,

    // Set to false in production. When set to true, the session id is set to "test", when collecting data.
    // This allow AI to remove entries with session_id=test
    useFixedSessionId:
      typeof process.env.USE_FIXED_SESSION_ID === "undefined" ||
      process.env.USE_FIXED_SESSION_ID !== "false" ||
      !process.env.USE_FIXED_SESSION_ID,
    fbi_api: {
      url:
        process.env.NEXT_PUBLIC_FBI_API_URL ||
        "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
      timeout: process.env.API_TIMEOUT_MS || 150,
    },
    fbi_api_simplesearch: {
      url:
        process.env.NEXT_PUBLIC_FBI_API_SIMPLESEARCH_URL ||
        "https://fbi-api-staging.k8s.dbc.dk/SimpleSearch/graphql",
      timeout: process.env.API_TIMEOUT_MS || 150,
    },
    app: {
      url: process.env.NEXTAUTH_URL,
    },
  },
};

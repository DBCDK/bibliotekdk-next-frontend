/**
 * @file
 * This is the configuration file for Next.js.
 *
 * See https://nextjs.org/docs/api-reference/next.config.js/introduction
 *
 * We set distDir, such that the build folder is located next to the storybook build
 */

module.exports = {
  distDir: "dist/next",
  // headers: async () => {
  //   return [
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
  //   ];
  // },
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
    cookiebot: {
      id: process.env.COOKIEBOT_ID || "23672b99-380a-4179-99ce-12e0fdd759cb",
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

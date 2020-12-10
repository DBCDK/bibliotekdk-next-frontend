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
  i18n: {
    locales: ["da", "en"],
    defaultLocale: "da",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  publicRuntimeConfig: {
    // Set to false in production. When set to true, the session id is set to "test", when collecting data.
    // This allow AI to remove entries with session_id=test
    useFixedSessionId:
      typeof process.env.USE_FIXED_SESSION_ID === "undefined" ||
      process.env.USE_FIXED_SESSION_ID !== "false" ||
      !process.env.USE_FIXED_SESSION_ID
        ? true
        : false,
  },
};

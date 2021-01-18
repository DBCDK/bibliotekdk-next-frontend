/**
 * @file
 * Application configuration.
 */
const config = {
  port: process.env.PORT || 3000,
  externalBaseUrl: process.env.EXTERNAL_BASE_URL || "http://beta.bibliotek.dk",
  api: {
    url:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://beta-api.bibliotek.dk/graphql",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
};

export default config;

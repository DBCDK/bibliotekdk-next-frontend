/**
 * @file
 * Application configuration.
 */
const config = {
  port: process.env.PORT || 3000,
  externalBaseUrl: process.env.EXTERNAL_BASE_URL || "https://bibliotek.dk",
  fbi_api: {
    url:
      process.env.NEXT_PUBLIC_FBI_API_URL ||
      "https://fbi-api.dbc.dk/bibdk21/graphql",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
  fbi_api_bibdk21: {
    url:
      process.env.NEXT_PUBLIC_FBI_API_BIBDK21_URL ||
      "https://fbi-api.dbc.dk/bibdk21/graphql",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
  backend: {
    url:
      process.env.NEXT_BACKEND_API_URL ||
      "http://bibdk-backend-www-master.febib-staging.svc.cloud.dbc.dk",
    timeout: process.env.API_TIMEOUT_MS || 150,
    cacheKey: process.env.NEXT_BACKEND_CACHE_KEY || "alfa",
  },
};

export default config;

/**
 * @file
 * Application configuration.
 */
const config = {
  port: process.env.PORT || 3000,
  externalBaseUrl: process.env.EXTERNAL_BASE_URL || "https://bibliotek.dk",
  api: {
    url:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://beta-api.bibliotek.dk/graphql",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
  backend: {
    url:
      process.env.NEXT_BACKEND_API_URL ||
      "http://bibdk-backend-www-develop.frontend-features.svc.cloud.dbc.dk/get_translations",
    internalurl: "/api/translate",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
};

export default config;

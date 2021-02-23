/**
 * @file
 * Application configuration.
 */
const config = {
  port: process.env.PORT || 3000,
  externalBaseUrl: process.env.EXTERNAL_BASE_URL || "https://bibliotek.dk",
  backend: {
    url:
      process.env.NEXT_BACKEND_API_URL ||
      "http://bibdk-backend-www-master.frontend-prod.svc.cloud.dbc.dk",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
};

export default config;

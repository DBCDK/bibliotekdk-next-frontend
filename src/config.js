/**
 * @file
 * Application configuration.
 */

const config = {
  port: process.env.PORT || 3000,
  api: {
    url:
      process.env.API_URL ||
      "http://bibliotekdk-next-api-1.frontend-staging.svc.cloud.dbc.dk/graphql",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
};

export default config;

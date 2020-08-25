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
  },
};

export default config;

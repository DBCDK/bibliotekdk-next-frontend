/**
 * @file
 * Application configuration.
 */
const config = {
  port: process.env.PORT || 3000,
  externalBaseUrl: process.env.EXTERNAL_BASE_URL || "https://bibliotek.dk",
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/graphql",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
  backend: {
    url: process.env.NEXT_BACKEND_API_URL || "http://localhost:7070",
    timeout: process.env.API_TIMEOUT_MS || 150,
  },
};

export default config;

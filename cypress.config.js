const {
  initPlugin,
} = require("@frsource/cypress-plugin-visual-regression-diff/plugins");

module.exports = {
  reporter: "junit",
  reporterOptions: {
    mochaFile: "app/e2e/reports/test-result-[hash].xml",
    toConsole: true,
  },
  env: {
    nextjsBaseUrl: "http://localhost:3000",
    graphqlPath: "/190101/bibdk21/graphql",
    fbiApiPath: "/api/bibdk21/graphql",
    fbiApiSimpleSearchPath: "/api/SimpleSearch/graphql",
  },
  retries: {
    runMode: 3,
    openMode: 0,
  },
  video: false,
  videoUploadOnPasses: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      return require("./cypress/plugins/index.js")(on, config);
    },
    excludeSpecPattern: [
      // this is "ignoreTestFiles" in Cypress v9
      "**/__snapshots__/*",
      "**/__image_snapshots__/*",
    ],
    baseUrl: "http://localhost:4000",
  },
};

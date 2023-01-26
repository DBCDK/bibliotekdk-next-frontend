module.exports = {
  reporter: "junit",
  reporterOptions: {
    mochaFile: "app/e2e/reports/test-result-[hash].xml",
    toConsole: true,
  },
  env: {
    nextjsBaseUrl: "http://localhost:3000",
    graphqlPath: "/190101/bibdk21/graphql",
    fbiApiPath: "/bibdk21/graphql",
  },
  retries: {
    runMode: 3,
    openMode: 0,
  },
  video: false,
  numTestsKeptInMemory: 0,
  videoUploadOnPasses: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:4000",
  },
};

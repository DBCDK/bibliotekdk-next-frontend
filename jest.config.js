const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  rootDir: "./",
  testPathIgnorePatterns: [
    "<rootDir>/e2e",
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
  ],
  testMatch: ["**/__test?(s)__/**/*.test.[jt]s?(x)", "!**/__fixtures__/**"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "css/animations": "identity-obj-proxy",
    "css/clamp": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less)$": "identity-obj-proxy",
  },
  testEnvironment: "jest-environment-jsdom",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

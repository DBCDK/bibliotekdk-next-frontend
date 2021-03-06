module.exports = {
  testPathIgnorePatterns: [
    "<rootDir>/e2e",
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less)$": "identity-obj-proxy",
  },
};

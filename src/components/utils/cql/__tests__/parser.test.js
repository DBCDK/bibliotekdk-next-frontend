const { tokenize, validateTokens } = require("../parser");
const validQueries = require("./testqueries.json");

describe("CQL parser", () => {
  test("Valid CQL queries", () => {
    // These are some queries that FBI-SCRUM uses for testing
    // the complex search parser
    validQueries.forEach((query) => {
      const tokens = tokenize(query);
      const result = validateTokens(tokens).filter((token) => token.error);
      expect(`${query} has errors: ${result.length}`).toEqual(
        `${query} has errors: 0`
      );
    });
  });
});

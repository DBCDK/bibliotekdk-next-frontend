const { tokenize, validateTokens } = require("../parser");
const validQueries = require("./validqueries.json");
const invalidQueries = require("./invalidqueries.json");

describe("CQL parser", () => {
  test("Valid CQL queries", () => {
    // These are some queries that FBI-SCRUM uses for testing
    // the complex search parser
    validQueries.forEach((query) => {
      const tokens = tokenize(query);
      const result = validateTokens(tokens).filter((token) => token.error);
      if (result.length > 0) {
        console.log(result);
      }
      expect(
        `'${query}' ${result.length > 0 ? "has errors" : "has no errors"}`
      ).toEqual(`'${query}' has no errors`);
    });
  });
  test("Invalid CQL queries", () => {
    // These are some queries that FBI-SCRUM uses for testing
    // the complex search parser
    invalidQueries.forEach((query) => {
      const tokens = tokenize(query);
      const result = validateTokens(tokens).filter((token) => token.error);
      expect(
        `'${query}' ${result.length > 0 ? "has errors" : "has no errors"}`
      ).toEqual(`'${query}' has errors`);
    });
  });
});

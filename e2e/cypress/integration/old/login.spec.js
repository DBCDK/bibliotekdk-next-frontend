/**
 * @file
 * Test login
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const graphqlPath = Cypress.env("graphqlPath");

describe("Login", () => {
  it(`should send bearer token to API`, () => {
    cy.intercept("POST", /.*graphql/, (req) => {
      console.log(req.headers.authorization);
      expect(req.headers.authorization).to.match(/bearer .+/i);
    }).as("apiRequest");

    cy.visit(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/work-of:870970-basis:53033423`
    );

    // Make sure api request with bearer token has been called
    cy.wait("@apiRequest");
  });
});

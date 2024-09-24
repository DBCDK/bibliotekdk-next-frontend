/**
 * @file
 * Test login
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

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

  it(`should set user pickupagency from url parameter`, () => {
    cy.intercept("POST", /.*graphql/, (req) => {
      console.log(req.headers.authorization);
      expect(req.headers.authorization).to.match(/bearer .+/i);
    }).as("apiRequest");

    cy.visit(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/work-of:870970-basis:53033423?setPickupAgency=999999`
    );

    // verify that parameter setPickupAgency has been removed by SetPickupBranch component
    cy.url().should("not.include", "setPickupAgency=999999");

    // Make sure api request with bearer token has been called
    cy.wait("@apiRequest");
  });
});

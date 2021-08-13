/**
 * @file
 * Test login
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Login", () => {
  it(`should send bearer token to API when logged in`, () => {
    // Mock session with access token
    cy.intercept("GET", "/api/auth/session", {
      statusCode: 200,
      body: { accessToken: "dummy-access-token" },
    }).as("sessionRequest");
    cy.visit(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/work-of:870970-basis:53033423`
    );

    // Try to comment out - seems like it waits too long
    // Wait for session to be fetched
    // cy.wait("@sessionRequest").then(() => {});

    // Intercept API request with bearer token
    cy.intercept({
      url: /.*graphql/,
      headers: {
        authorization: "Bearer dummy-access-token",
      },
    }).as("apiRequest");

    // Make sure api request with bearer token has been called
    cy.wait("@apiRequest");
  });

  it(`should not send bearer token when not logged in`, () => {
    // Intercept API request
    cy.intercept(/.*graphql/).as("apiRequest");

    cy.visit(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/work-of:870970-basis:53033423`
    );

    cy.wait("@apiRequest")
      .its("request.headers.authorization")
      .should("not.exist");
  });
});

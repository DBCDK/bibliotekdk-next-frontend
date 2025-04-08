/**
 * @file
 * Test login
 */

const fbiApiPath = Cypress.env("fbiApiPath");

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Login", () => {
  it(`should send request to API with valid session`, () => {
    cy.intercept("POST", fbiApiPath).as("apiRequest");

    cy.visit(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/work-of:870970-basis:53033423`
    );

    // Ensure backend proxy is hit
    cy.wait("@apiRequest").its("response.statusCode").should("eq", 200);
  });

  it(`should set user pickupagency from url parameter`, () => {
    cy.intercept("POST", fbiApiPath).as("apiRequest");

    cy.visit(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/work-of:870970-basis:53033423?setPickupAgency=999999`
    );

    // Verify that the parameter has been removed by frontend logic
    cy.url().should("not.include", "setPickupAgency=999999");

    // Ensure backend proxy is hit
    cy.wait("@apiRequest").its("response.statusCode").should("eq", 200);
  });
});

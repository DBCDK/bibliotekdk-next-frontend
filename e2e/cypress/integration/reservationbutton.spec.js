/**
 * @file
 * Test functionality of reservation button - see also @overview.spec.js
 */
describe("Reservation button", () => {
  it(`user logged in material available`, () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-active"
    );

    cy.get("[data-cy=button-order-overview-enabled]").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("order");
    });
  });

  it(`user logged in material unavailable`, () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-inactive"
    );
    cy.get("[data-cy=button-order-overview]").should("be.disabled");
  });

  it(`user not logged in material available`, () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-not-logged-in"
    );
    cy.get("[data-cy=button-order-overview]")
      .contains("Bestil (ikke logget ind)")
      .should("be.visible")
      .click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("login");
    });
  });

  // @TODO more testing - request_button:false eg.
});

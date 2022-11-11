/**
 * @file
 * Test functionality of reservation button - see also @overview.spec.js
 */
describe("Reservation button", () => {
  describe("OrderButton", () => {
    it(`user logged in material available`, () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton--reservation-button-physical-book"
      );

      cy.get("[data-cy=button-order-overview-enabled]").click();
      cy.on("window:alert", (str) => {
        expect(str).to.equal("order");
      });
    });

    it(`user logged in material unavailable`, () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton--reservation-button-disabled"
      );
      cy.get("[data-cy=button-order-overview]").should("be.disabled");
    });

    it("user not logged in then above text is shown", () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton--order-button-not-logged-in"
      );
      cy.get("[data-cy=button-order-overview]").contains("Gå til");
      cy.get("[data-cy=text-above-order-button").contains("Kræver");
    });

    it("does not display 'deaactivated' text, when it is loading", () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton--reservation-button-slow-response&viewMode=story"
      );

      // This text is hidden by skeleton animation
      cy.get("[data-cy=button-order-overview]").should(
        "include.text",
        "loading"
      );

      // It must not show deactivated text while loading
      cy.get("[data-cy=button-order-overview]").should(
        "not.include.text",
        "deaktiveret"
      );
    });

    it.skip(`user not logged in material available`, () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton--order-button-not-logged-in"
      );
      cy.get("[data-cy=button-order-overview-enabled]")
        .contains("Bestil")
        .should("be.visible")
        .click();
      cy.on("window:alert", (str) => {
        expect(str).to.equal("login");
      });
    });

    // @TODO more testing - request_button:false eg.
  });

  describe("ButtonTxt", () => {
    it("should have book button text", () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--book-button-txt"
      );

      cy.get("[data-cy=reservation-button-txt]").contains("Fysiske materialer");
    });

    it("should have ebook button text", () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--e-book-button-txt"
      );

      cy.get("[data-cy=reservation-button-txt]").contains("ereol");
    });

    it("should have eaudiobook physical button text", () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--e-audio-book-physical-button-txt"
      );

      cy.get("[data-cy=reservation-button-txt]").contains("Fysiske materialer");
    });

    it("should have eaudiobook digital button text", () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--e-audio-book-digital-button-txt"
      );

      cy.get("[data-cy=reservation-button-txt]").contains("nota");
    });

    it("should have Periodica button text", () => {
      cy.visit(
        "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--periodica-button-txt"
      );

      cy.get("[data-cy=reservation-button-txt]").contains(
        "Du kan bestille en artikel eller et bestemt eksemplar"
      );
    });
  });
});

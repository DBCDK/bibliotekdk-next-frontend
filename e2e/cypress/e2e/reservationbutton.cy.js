/**
 * @file
 * Test functionality of reservation button - see also @overview.spec.js
 */
describe("Reservation button", () => {
  it("user logged in material available", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-physical-book"
    );

    cy.get("[data-cy=button-order-overview-enabled]", {
      timeout: 15000,
    }).click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("order");
    });
  });

  it("physical material click opens modal with query params", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-physical-book"
    );

    cy.get("[data-cy=button-order-overview-enabled]", { timeout: 15000 })
      .should("contain", "Bestil")
      .click();

    cy.get("[data-cy=router-query]").contains("modal");
  });

  it("digital material", () => {
    const urla =
      "/iframe.html?id=work-reservationbutton--reservation-button-e-book";

    cy.visit(urla);
    cy.intercept(urla).as("urlan");

    cy.window().then((win) => {
      cy.stub(win, "open").as("Open");
      win.first = true;
    });

    cy.window().its("first").should("be.true");

    cy.get("[data-cy=button-order-overview]").should("exist").click();

    // We test if the window is "opening" properly
    cy.get("@Open").should(
      "have.been.calledOnceWith",
      "https://ereol.combo/langurl"
    );
  });

  it("user logged in material unavailable", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-disabled"
    );
    cy.get("[data-cy=button-order-overview-disabled]").should("be.disabled");
  });

  it("user not logged in then above text is shown", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-not-logged-in"
    );
    cy.get("[data-cy=button-order-overview]").contains("Gå til");
    cy.get("[data-cy=text-above-order-button").contains("Kræver");
  });

  it("does not display 'deaactivated' text, when it is loading", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-slow-response&viewMode=story"
    );

    // This text is hidden by skeleton animation
    cy.get("[data-cy=button-order-overview-loading]").should("exist");

    // It must not show deactivated text while loading
    cy.get("[data-cy=button-order-overview-loading]").should(
      "not.include.text",
      "deaktiveret"
    );
  });

  it("user not logged in material available", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-not-logged-in"
    );
    cy.get("[data-cy=button-order-overview]")
      .focus()
      .should("contain", "Gå til")
      .should("be.visible")
      .click();

    cy.on("window:alert", (window) => {
      expect(window).to.contain("DU SKAL LOGGE IND");
    });
  });

  it("user logged in loan is not possible for material", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-physical-book-loan-not-possible"
    );
    cy.get("[data-cy=button-order-overview-disabled]").should("be.disabled");
  });

  it("onclick should open order-modal, if user logged ind", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-login-flow"
    );
    cy.get("[data-cy=button-order-overview-enabled]", { timeout: 15000 })
      .should("exist", { timeout: 15000 })
      .click();
    //add order modal to the store
    cy.window().then((win) => {
      const addedItem = win.localStorage.getItem("modal-v2");
      console.log("addedItem", addedItem);
      const modal = JSON.parse(addedItem);
      const uid = modal[0].id;
      expect(uid).to.be.equal("order");
    });
    //open login modal - we cannot check that it actually is the login modal that is opened
    cy.get("[data-cy=router-query]").contains("modal");
  });

  it("onclick should open login-modal and add order modal to store, if user NOT logged ind", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton--reservation-button-not-logged-in-flow"
    );
    cy.get("[data-cy=button-order-overview-enabled]", { timeout: 15000 })
      .should("exist", { timeout: 15000 })
      .click();
    //dont add order modal to the store
    cy.window().then((win) => {
      const addedItem = win.localStorage.getItem("modal-v2-store");
      //TODO when less flaky, check if "modal-v2-store" contains "Order"

      expect(addedItem).to.be.equal(null);
    });
    //open some modal directly - we cannot check if it actually is the order modal that is opened
    cy.get("[data-cy=router-query]").contains("modal");
  });
});

describe("ButtonTxt", () => {
  it("should have book button text", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--book-button-txt"
    );

    cy.get("[data-cy=reservation-button-txt]").should(
      "contain",
      "Fysiske materialer"
    );
  });

  it("should have ebook button text", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--e-book-button-txt"
    );

    cy.get("[data-cy=reservation-button-txt]").should("contain", "ereol");
  });

  it("should have eaudiobook physical button text", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--e-audio-book-physical-button-txt"
    );

    cy.get("[data-cy=reservation-button-txt]").should(
      "contain",
      "Fysiske materialer"
    );
  });

  it("should have eaudiobook digital button text", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--e-audio-book-digital-button-txt"
    );

    cy.get("[data-cy=reservation-button-txt]").should("contain", "nota");
  });

  it("should have Periodica button text", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--periodica-button-txt"
    );

    cy.get("[data-cy=reservation-button-txt]").should(
      "contain",
      "Du kan bestille en artikel eller et bestemt eksemplar"
    );
  });

  it("should have slow loading", () => {
    cy.visit(
      "/iframe.html?id=work-reservationbutton-orderbuttontextbelow--slow-loading-button-txt"
    );

    cy.get("[data-cy=skeleton]").should("exist");
  });
});

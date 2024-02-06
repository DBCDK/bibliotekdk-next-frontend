describe("BookmarkOrderSingle", () => {
  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });
  it(`Order a single material from bookmarklist`, () => {
    cy.visit(
      "/iframe.html?id=modal-materials--materials-to-order-single-material"
    );

    cy.wait(1000);
    // open order modal
    cy.get("[data-cy=multiorder-next-button]")
      .should(($el) => {
        expect(Cypress.dom.isDetached($el)).to.eq(false);
      })
      .click();

    cy.get("[data-cy=button-godkend]").should("exist").click();
    // order successfully
    cy.contains("Bestillingen blev gennemført");
  });

  it(`Order again must be confirmed`, () => {
    cy.visit(
      "/iframe.html?id=modal-materials--materials-to-order-single-material"
    );

    cy.wait(1000);
    // open order modal
    cy.get("[data-cy=multiorder-next-button]")
      .should(($el) => {
        expect(Cypress.dom.isDetached($el)).to.eq(false);
      })
      .click();

    // user should confirm reorder of material
    cy.contains("materialer er allerede bestilt").should("exist");

    cy.get("[data-cy=text-bestil-alligevel]").should("exist").click();

    cy.get("[data-cy=button-godkend]").should("exist").click();
    // order successfully
    cy.contains("Bestillingen blev gennemført");
  });
});

describe("BookmarkOrderOnlineAndPhysical", () => {
  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });
  it(`Order two materials - one is online, one is physical`, () => {
    cy.visit("/iframe.html?id=modal-materials--materials-to-order-double");

    cy.contains("1 materiale findes online, og kræver ikke bestilling").should(
      "exist"
    );
    // open order modal
    cy.get("[data-cy=multiorder-next-button]")
      .should(($el) => {
        expect(Cypress.dom.isDetached($el)).to.eq(false);
      })
      .click();

    // there should be one element
    cy.get("article").should("exist").should("have.length", 1);

    cy.get("[data-cy=button-godkend]").should("exist").click();
    // order successfully
    cy.contains("Bestillingen blev gennemført");
  });
});

describe("BookmarkOrderUserIsBlocked", () => {
  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });
  it(`Try to Order - user is blocked`, () => {
    cy.visit("/iframe.html?id=modal-materials--blocked-user");

    cy.contains("1 materiale findes online, og kræver ikke bestilling").should(
      "exist"
    );
    // open order modal
    cy.get("[data-cy=multiorder-next-button]")
      .should(($el) => {
        expect(Cypress.dom.isDetached($el)).to.eq(false);
      })
      .click();

    // User is blocke
    cy.contains("Biblioteket modtager desværre ikke bestillinger fra dig.");
  });
});

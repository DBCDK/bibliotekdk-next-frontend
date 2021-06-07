/**
 * @file
 * Test feedback
 */
describe("feedback", () => {
  before(function () {
    cy.visit("/iframe.html?id=base-feedback--feedback", {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      },
    });
  });

  it(`View in BIG viewport`, () => {
    cy.viewport(1920, 1080);
    // verify that banner is shown
    cy.get("[data-cy=feedback-toggle]").should("be.visible");
    cy.get("[data-cy=feedback-link-text]").should("not.be.visible");
  });

  it(`View in SMALL viewport`, () => {
    cy.viewport(765, 1080);
    // verify that banner is NOT shown
    cy.get("[data-cy=feedback-toggle]").should("be.visible");
    cy.get("[data-cy=feedback-link-text]").should("not.be.visible");
  });

  it("toggle feedback", () => {
    cy.get("[data-cy=feedback-toggle]").click();
    cy.get("[data-cy=feedback-link-text]").should("be.visible");
  });

  it("toggle feedback", () => {
    cy.get("[data-cy=feedback-toggle]").click();
    cy.get("[data-cy=feedback-link-text]").should("not.be.visible");
  });

  it("test session timer", () => {
    cy.wait(2000);
    cy.visit("/iframe.html?id=base-feedback--feedback");
    cy.get("[data-cy=feedback-link-text]").should("be.visible");
  });

  it("test cookie timer", () => {
    cy.get("[data-cy=feedback-cookie-close]").should("be.visible");
    cy.get("[data-cy=feedback-cookie-close]").click();
    cy.get("[feedback-wrapper]").should("not.exist");
    cy.wait(5000);
    cy.visit("/iframe.html?id=base-feedback--feedback");
    cy.get("[data-cy=feedback-toggle]").should("be.visible");
  });
});

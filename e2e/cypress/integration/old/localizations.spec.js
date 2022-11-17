/**
 * @file
 * Test functionality of localizations
 */
describe("Localization link", () => {
  // TODO: Auto mock this one
  it("Localizations list with holdings", () => {
    cy.visit("/iframe.html?id=modal-localizations--localizations-list");
    cy.get('[data-cy="pickup-search-input"]').should("be.visible");

    // there are 3 holdingsitems
    cy.get('[data-cy="holdings-item-0"]').should("be.visible");
    cy.get('[data-cy="holdings-item-1"]').should("be.visible");
    cy.get('[data-cy="holdings-item-2"]').should("be.visible");

    cy.wait(500);
  });

  it(`Localization link present`, () => {
    cy.visit("/iframe.html?id=modal-localizations--localization-item-loading");
    cy.get(`[data-cy="blinking-0-localizationloader"]`)
      .should("have.attr", "role")
      .should("equal", "progressbar");

    cy.get(`[data-cy="blinking-0-localizationloader"]`)
      .should("have.attr", "aria-live")
      .should("equal", "polite");
  });

  it(`Localization link present`, () => {
    cy.visit("/iframe.html?id=modal-localizations--localization-link");
    cy.get(`[data-cy="link-localizations"]`)
      .should("have.attr", "aria-label")
      .should("equal", "open localizations");
    cy.get(`[data-cy="link-localizations"]`).click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("localizations");
    });
  });
});

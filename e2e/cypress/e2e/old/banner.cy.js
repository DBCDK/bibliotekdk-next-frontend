/**
 * @file
 * Test banner
 */
describe("TopBanner", () => {
  beforeEach(function () {
    cy.visit("/iframe.html?id=layout-banner--top-banner");
  });

  it(`View in BIG viewport`, () => {
    cy.viewport(1920, 1080);
    // verify that banner is shown
    cy.get("[data-cy=top-banner]").should("be.visible");
  });

  it(`View in SMALL viewport`, () => {
    cy.viewport(765, 1080);
    // verify that banner is NOT shown
    cy.get("[data-cy=top-banner]").should("not.be.visible");
  });
});

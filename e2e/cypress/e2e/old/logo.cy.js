/**
 * @file
 * Test log
 */
describe("Logo", () => {
  it(`View in BIG viewport`, () => {
    cy.visit("/iframe.html?id=base-logo--default-logo");
    cy.viewport(1920, 1080);
    // verify that banner is shown
    cy.get("[data-cy=key-logo]").should("be.visible");
    cy.get("[data-cy=key-logo]").should("have.attr", "href").and("equal", "/");
  });

  it(`View in SMALL viewport`, () => {
    cy.visit("/iframe.html?id=base-logo--blue-logo");
    cy.viewport(765, 1080);
    // verify that banner is NOT shown
    cy.get("[data-cy=key-logo]").should("be.visible");
    cy.get("[data-cy=key-logo]")
      .should("have.attr", "href")
      .and("equal", "/hjaelp");
  });
});

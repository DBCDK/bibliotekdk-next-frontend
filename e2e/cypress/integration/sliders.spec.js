/**
 * @file
 * Test functionality of cards
 */
describe("Sliders", () => {
  it(`Buttons may be used to slide`, () => {
    cy.visit("/iframe.html?id=slider--work-slider&viewMode=story");
    cy.get("[data-cy=work-card").first().should("be.visible");
    cy.get("[data-cy=work-card").last().should("not.be.visible");

    cy.get("[data-cy=arrow-right]").click();
    cy.get("[data-cy=work-card").first().should("not.be.visible");
    cy.get("[data-cy=work-card").last().should("be.visible");

    cy.get("[data-cy=arrow-left]").click();
    cy.get("[data-cy=work-card").first().should("be.visible");
    cy.get("[data-cy=work-card").last().should("not.be.visible");
  });

  it(`Tabbing may be used to slide`, () => {
    cy.visit("/iframe.html?id=slider--work-slider&viewMode=story");
    cy.get("[data-cy=work-card").first().should("be.visible");
    cy.get("[data-cy=work-card").last().should("not.be.visible");

    // Tab 10 times
    cy.get("body").tab().tab().tab().tab().tab().tab().tab().tab().tab().tab();

    cy.get("[data-cy=work-card").first().should("not.be.visible");
    cy.get("[data-cy=work-card").last().should("be.visible");
  });
});

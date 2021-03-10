/**
 * @file
 * Test functionality of cards
 */
describe("Sliders", () => {
  it(`Buttons may be used to slide`, () => {
    cy.visit("/iframe.html?id=base-slider--work-slider&viewMode=story");
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
    cy.visit("/iframe.html?id=base-slider--work-slider&viewMode=story");
    cy.get("[data-cy=work-card").first().should("be.visible");
    cy.get("[data-cy=work-card").last().should("not.be.visible");

    // Tab 10 times
    cy.get("body").tabs(10);

    cy.get("[data-cy=work-card").first().should("not.be.visible");
    cy.get("[data-cy=work-card").last().should("be.visible");
  });
});

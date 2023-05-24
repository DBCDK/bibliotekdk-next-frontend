/**
 * @file
 * Test functionality of cards
 */
describe("Sliders", () => {
  it(`Buttons may be used to slide`, () => {
    cy.visit("/iframe.html?id=base-slider--work-slider&viewMode=story");
    cy.viewport(1920, 1080);

    cy.contains("Simeons brud").should("be.visible");
    cy.contains("Et spor af ild").should("not.be.visible");

    cy.get("[data-cy=right_arrow]")
      .click()
      .get("body")
      .then((body) => expect(body).to.contain("Simeons brud"));
    cy.contains("Et spor af ild").should("be.visible");

    cy.get("[data-cy=left_arrow]").click();
    cy.contains("Simeons brud").should("be.visible");
  });

  it(`Tabbing may be used to slide`, () => {
    cy.visit("/iframe.html?id=base-slider--work-slider&viewMode=story");
    cy.get("[data-cy=link]").first().should("be.visible");
    cy.get("[data-cy=link]").last().should("not.be.visible");

    // Tab 10 times
    cy.get("[data-cy=link]").tabs(10);

    cy.get("[data-cy=link]").first().should("not.be.visible");
    cy.get("[data-cy=link]").last().should("be.visible");
  });
});

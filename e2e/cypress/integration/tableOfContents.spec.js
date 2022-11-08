describe("Table of Contents", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-content--content-section&viewMode=story");
  });
  it(`Displays the table of contents for a work`, () => {
    cy.contains("Indhold");
    cy.contains("Kapitel 1");
    cy.contains("Kapitel 2");
    cy.contains("Kapitel 3");
    cy.contains("Kapitel 4");
  });
});

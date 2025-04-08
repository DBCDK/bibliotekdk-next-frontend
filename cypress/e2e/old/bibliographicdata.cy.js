/**
 * @file
 * Test functionality of bibliographic data
 */

describe("bibliographic data", () => {
  it("open edition - check contents", () => {
    cy.visit("/iframe.html?id=work-bibliographic-data--bib-data");
    // get first edition
    cy.get("[data-cy=accordion-item]").first().click();
    cy.get("[data-cy=edition-data-skabere]", { timeout: 10000 })
      .find("a")
      .should("have.attr", "href")
      .should("not.be.empty")
      .and("contain", "/find?q.all=");
    cy.get("[data-cy=link-references]").contains(
      "Download til referencesystemer"
    );

    cy.contains("Kopier link til udgave");
  });

  it("Full manifestation - check localizationlink", () => {
    cy.visit("/iframe.html?id=work-bibliographic-data--full-manifestation");

    cy.contains("Se om den er hjemme på dit bibliotek");
    cy.contains("Kopier link til udgave");
  });
});

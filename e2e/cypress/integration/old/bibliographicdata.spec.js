/**
 * @file
 * Test functionality of bibliographic data
 */

describe("bibliographic data", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-bibliographic-data--bib-data");
  });
  it("open edition - check creator link", () => {
    // get first edition
    cy.get("[data-cy=accordion-item]").first().click();
    cy.get("[data-cy=edition-data-af] span a")
      .should("have.attr", "href")
      .should("not.be.empty")
      .and("contain", "/find?q.creator=Lucinda%20Riley");
  });

  it("open edition - check link to references", () => {
    // get first edition
    cy.get("[data-cy=accordion-item]").first().click();
    cy.get("[data-cy=link-references] p")
      .first()
      .should("have.text", "Download til referencesystemer");
  });

  it("Full manifestation - check localizationlink", () => {
    cy.visit("/iframe.html?id=work-bibliographic-data--full-manifestation");
    cy.get("[data-cy=link-localizations] p").should(
      "have.text",
      "Se om den er hjemme på dit bibliotek"
    );
  });
});

/**
 * @file
 * Test functionality of reference systems
 */
describe("References", () => {
  it(`Reference links present`, () => {
    cy.visit("/iframe.html?id=modal-references--reference-links");

    const links = ["refworks", "endnote", "file"];
    links.forEach((link) =>
      cy.get(`[data-cy="${link}"]`).should("have.attr", "href")
    );
  });

  it(`Single Edition with year, publisher etc`, () => {
    cy.visit("/iframe.html?id=modal-references--edition-single-manifestation");

    // there should be additional text for specific edition
    cy.get("[data-cy=additional_edition_info]").contains(
      "2018, Cicero ,1. udgave"
    );
  });
});

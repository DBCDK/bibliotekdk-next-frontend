/**
 * @file
 * Test functionality of reference systems
 */
describe("References", () => {
  it(`Reference links present`, () => {
    cy.visit("/iframe.html?id=modal-references--reference-links");

    ["refworks", "endnote", "file"].forEach((link) =>
      cy.get(`[data-cy="${link}"]`).should("have.attr", "href")
    );
  });
});

/**
 * test the details section
 */

describe("Description", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-description--description-section");
  });

  // some simple tests - at least they are there
  it(`Elements in details present`, () => {
    cy.get("[data-cy=description]").should(
      "contain.text",
      "Lorem ipsum dolor sit amet"
    );
  });
});

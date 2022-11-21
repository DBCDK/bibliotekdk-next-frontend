describe("Overview", () => {
  before(function () {
    cy.visit("/iframe.html?id=layout-footer--footer-story");
  });

  it("there should be 4 columns", () => {
    cy.get("[data-cy=footer-section] [data-cy=footer-column]").should(
      "have.length",
      4
    );
  });

  // this one fails if an image is added to footer
  // @TODO - there is no img no more - it is an svg - check for that and enable test
  it.skip("check logo", () => {
    cy.get("[data-cy=footer-section] [data-cy=footer-column]")
      .find("img")
      .should("have.attr", "src")
      .should("include", "logowhite");
  });

  it("check contact links", () => {
    cy.get(
      "[data-cy=footer-section] [data-cy=footer-column] [data-cy=contactlink]"
    ).should("have.length", 7);
  });

  it("check branch links", () => {
    cy.get(
      "[data-cy=footer-section] [data-cy=footer-column] [data-cy=branchlink]"
    ).should("have.length", 6);
  });
});

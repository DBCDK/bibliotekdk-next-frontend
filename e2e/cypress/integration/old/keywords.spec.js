/**
 * @file
 * Test functionality of Text
 */
describe("Keywords", () => {
  beforeEach(function () {
    cy.visit("/iframe.html?id=work-keywords--keywords-section");
  });

  it(`Keywords gets filtered`, () => {
    cy.get("[data-cy=words-container]")
      // Norge should not contain a dot (.) in the end
      .should("not.contain", "Whiskyland.")
      // The tag "Dont show me!" should not be returned
      .should("not.contain", "Dont show me!")
      // 17 of 19 elements should be returned
      .children()
      .should("have.length", 17);
    // Norge is a duplicate, but should only be returned once
    cy.get("[data-cy=keywords-whiskyland]").should("have.length", 1);
  });

  it(`Can tab through keywords`, () => {
    cy.get("[data-cy=keywords-whiskyland]")
      .should("exist")
      .tab()
      .should("have.attr", "data-cy", "keywords-snapseland")
      .tabs(15)
      .should("have.attr", "data-cy", "keywords-ginland");
  });

  it(`Can visit keywords`, () => {
    const tag = "borgonjeland";
    const url = `/find?q.subject=${tag}`;

    // Get selected tag
    cy.get(`[data-cy=keywords-${tag}]`)
      .should("have.attr", "target", "_self")
      .should("have.attr", "href", url);
  });
});

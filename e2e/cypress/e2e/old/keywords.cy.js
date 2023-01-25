/**
 * @file
 * Test functionality of Text
 */
describe("Keywords", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-keywords--keywords-section");
  });

  it(`Keywords gets filtered`, () => {
    cy.get("[data-cy=keywords]")
      // Norge should not contain a dot (.) in the end
      .should("not.contain", "Norge.")
      // The tag "Dont show me!" should not be returned
      .should("not.contain", "Dont show me!")
      // 17 of 19 elements should be returned
      .children()
      .should("have.length", 17);
    // Norge is a duplicate, but should only be returned once
    cy.get("[data-cy=keywords] [data-cy=keyword-norge]").should(
      "have.length",
      1
    );
  });

  it(`Can tab through keywords`, () => {
    cy.get("body").tab();

    cy.focused()
      .parent()
      .should("have.attr", "data-cy", "keyword-far-søn-forholdet");

    cy.tabs(16);

    cy.focused().parent().should("have.attr", "data-cy", "keyword-2000-2009");
  });

  it(`Can visit keywords`, () => {
    const tag = "barndom";
    const url = `/find?q.subject=${tag}`;

    // Get selected tag
    cy.get(`[data-cy=keyword-${tag}]`)
      .children()
      .should("have.attr", "target", "_self")
      .should("have.attr", "href", url);
  });
});

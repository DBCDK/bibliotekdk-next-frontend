/**
 * @file
 * Test functionality of Text
 */
describe("Keywords", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-keywords--description-section");
  });

  it(`Keywords gets filtered`, () => {
    const container = cy.get("[data-cy=keywords]");

    // 17 of 19 elements should be returned
    container.children().should("have.length", 17);

    // Norge is a duplicate, but should only be returned once
    container.get("[data-cy=keyword-norge]").should("have.length", 1);

    // Norge should not contain a dot (.) in the end
    container.should("not.contain", "Norge.");

    // The tag "Dont show me!" should not be returned
    container.should("not.contain", "Dont show me!");
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
    const url = `https://bibliotek.dk/da/search/work?search_block_form=phrase.subject%3D%22${tag}%22#content`;

    // Get selected tag
    const item = cy.get(`[data-cy=keyword-${tag}]`).children();

    // Check link attributes
    item.should("have.attr", "target", "_blank");
    item.should("have.attr", "href", url);
  });
});

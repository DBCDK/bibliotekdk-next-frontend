/**
 * @file
 * Test functionality of Text
 */

describe("Related Keywords", () => {
  it(`Can tab through related keywords`, () => {
    cy.visit("/iframe.html?id=work-relatedsubjects--default");
    cy.get("body").tab();
    cy.focused().should("have.attr", "data-cy", "related-subject-heste");
    cy.tabs(10);
    cy.focused().should("have.attr", "data-cy", "related-subject-heste");
  });

  it(`Can visit keywords`, () => {
    cy.visit("/iframe.html?id=work-relatedsubjects--default");

    const tag = "ridning";
    const url = `/find?q.subject=${tag}`;

    // Get selected tag
    cy.get(`[data-cy=related-subject-${tag}]`)
      .should("have.attr", "target", "_self")
      .should("have.attr", "href", url);
  });

  it(`Can render and interact with connected related subjects`, () => {
    cy.visit("/iframe.html?id=work-relatedsubjects--connected");
    cy.get("[data-cy=words-container]").children().should("have.length", 2);
    cy.get("[data-cy=words-container]")
      .children()
      .each((el, idx) => {
        expect(
          el[0].href.indexOf(`/find?q.subject=relatedSubjects[${idx}]`) !== -1
        ).to.be.true;
      });
  });
});

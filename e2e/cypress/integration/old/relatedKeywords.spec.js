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
      // Check link attributes
      .should("have.attr", "target", "_self")
      .should("have.attr", "href", url);
  });

  it(`Can render and interact with connected related subjects`, () => {
    cy.visit("/iframe.html?id=work-relatedsubjects--connected");
    cy.get("[data-cy=words-container]")
      .should("exist")
      .children()
      .should("have.length", 2)
      .each((el, idx) => {
        cy.get(el).click();
        cy.get("[data-cy=router-pathname]").should("have.text", "/find");
        cy.get("[data-cy=router-query]").should(
          "have.text",
          `{"q.subject":"relatedSubjects[${idx}]"}`
        );
      });
  });
});

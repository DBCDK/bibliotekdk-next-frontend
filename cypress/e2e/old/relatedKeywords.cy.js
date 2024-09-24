/**
 * @file
 * Test functionality of Text
 */

describe("Related Keywords", () => {
  it(`Can tab through related keywords`, async () => {
    await cy.visit("/iframe.html?id=work-relatedsubjects--default");
    cy.get("body")
      .tab()
      .should("have.attr", "data-cy", "related-subject-heste");
    cy.tabs(9);
    cy.focused().tab().should("have.attr", "data-cy", "related-subject-heste");
  });

  it(`Can visit keywords`, async () => {
    await cy.visit("/iframe.html?id=work-relatedsubjects--default");

    const tag = "ridning";
    const url = `/find?q.subject=${tag}`;

    // Get selected tag
    cy.get(`[data-cy=related-subject-${tag}]`)
      .should("have.attr", "target", "_self")
      .should("have.attr", "href", url);
  });

  it(`Can render and interact with connected related subjects`, () => {
    cy.visit("/iframe.html?id=work-relatedsubjects--connected");
    cy.get("[data-cy=words-container]", { timeout: 10000 })
      .should("exist")
      .children()
      .should("exist")
      .should("have.length.least", 3);

    cy.get("[data-cy=related-subject-savn]", {
      timeout: 10000,
    }).should(
      "have.attr",
      "href",
      "/avanceret?fieldSearch=%7B%22inputFields%22%3A%5B%7B%22value%22%3A%22savn%22%2C%22prefixLogicalOperator%22%3Anull%2C%22searchIndex%22%3A%22term.subject%22%7D%5D%7D"
    );
    cy.get("[data-cy=related-subject-melankoli]", {
      timeout: 10000,
    }).should(
      "have.attr",
      "href",
      "/avanceret?fieldSearch=%7B%22inputFields%22%3A%5B%7B%22value%22%3A%22melankoli%22%2C%22prefixLogicalOperator%22%3Anull%2C%22searchIndex%22%3A%22term.subject%22%7D%5D%7D"
    );
  });
});

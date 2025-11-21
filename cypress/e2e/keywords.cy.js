/**
 * @file
 * Test functionality of Text
 */
describe("Keywords", () => {
  beforeEach(function () {
    cy.visit("/iframe.html?id=work-keywords--keywords-section");
  });

  it(`When keyword has language, it must be danish`, () => {
    cy.contains("historie");
    cy.get("[data-cy=keywords]").should("not.contain", "heimsbardagi");
  });

  it(`Keywords must be unique`, () => {
    cy.get("[data-cy=keywords] [data-cy=keyword-historie]").should(
      "have.length",
      1
    );
  });

  it(`Subjects should be grouped`, () => {
    // Locations and time periods must be grouped together
    cy.get("[data-cy=keyword-group-1").contains("Tyskland");
    cy.get("[data-cy=keyword-group-1").contains("1930-1939");

    // And the rest must be in another group
    cy.get("[data-cy=keyword-group-0").contains("historie");
    cy.get("[data-cy=keyword-group-0").contains("den 2. verdenskrig");
  });

  it(`Can tab through keywords`, () => {
    // Wait for keywords to be loaded
    cy.contains("historie");

    cy.get("body").tab();

    cy.focused()
      .parent()
      .parent()
      .should("have.attr", "data-cy", "keyword-historie");

    cy.tabs(3);

    cy.focused()
      .parent()
      .parent()
      .should("have.attr", "data-cy", "keyword-1930-1939");
  });

  it(`Can visit keywords`, () => {
    const tag = "historie";

    // Get selected tag
    cy.get(`[data-cy=keyword-${tag}]`)
      .children()
      .children()
      .should("have.attr", "target", "_self")
      .should("have.attr", "href")
      .and("include", "/find/simpel?q.all=");
  });
});

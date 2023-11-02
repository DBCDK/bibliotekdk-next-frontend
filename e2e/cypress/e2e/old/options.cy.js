/**
 * @file
 * Test functionality modal options for article access
 */
describe("Overview", () => {
  it(`All option links present`, () => {
    cy.visit("/iframe.html?id=modal-options--all-options");
    cy.contains("Alle bestillingsmuligheder (3)", { timeout: 15000 }).click();

    cy.contains("Alle bestillingsmuligheder", { timeout: 15000 }).should(
      "exist"
    );
    cy.contains("Luk");
    cy.contains("Link til E-bog")
      .should("exist")
      .parent()
      .find("a")
      .should("have.attr", "href", "https://ereol.combo/langurl");

    cy.contains("Bestil digital kopi").should("exist");

    cy.contains("Læs artikel")
      .should("exist")
      .parent()
      .find("a")
      .should(
        "have.attr",
        "href",
        "/infomedia/manifestations-1-titles-main-0-_linoleum-gummigulv/work-of:some-pid-7/123123"
      );
  });
});

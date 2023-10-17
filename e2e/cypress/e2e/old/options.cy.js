/**
 * @file
 * Test functionality modal options for article access
 */
describe("Overview", () => {
  before(function () {
    cy.visit("/iframe.html?id=modal-options--all-options");
  });

  it(`All option links present`, () => {
    cy.contains("fiske", { timeout: 10000 }).should("exist");
    cy.contains("Luk");
    cy.contains("Link til ebog")
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
        "/infomedia/manifestations-6-titles-main-0-_linoleum-gummigulv/work-of:some-pid-7/123123"
      );
  });
});

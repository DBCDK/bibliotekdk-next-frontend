const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("help", () => {
  it(`Search: should show empty response message`, () => {
    cy.visit("/iframe.html?path=/story/help-search--no-results");
    cy.contains("Din søgning giver ingen resultater");
  });
  it(`Search: should show two results`, () => {
    cy.visit("/iframe.html?path=/story/help-search--show-results");
    cy.get("[data-cy=result-row").its("length").should("eq", 2);

    cy.tabs(3);
    cy.focused().should(
      "have.attr",
      "href",
      "/hjaelp/saadan-soeger-du-i-bibliotek.dk/1"
    );
    cy.tabs(1);
    cy.focused().should("have.attr", "href", "/hjaelp/om-login/2");
  });
});

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("help", () => {
  it(`Search: should show empty response message`, () => {
    cy.visit("/iframe.html?path=/story/help-search--no-results");
    cy.contains("Din søgning giver ingen resultater");
    cy.get("[data-cy=faq]").should("be.visible");
  });
  it(`Search: should show two results`, () => {
    cy.visit("/iframe.html?path=/story/help-search--show-results");
    cy.get("[data-cy=result-row]").its("length").should("eq", 2);

    // FAQ should be hidden when there are results
    cy.get("[data-cy=faq]").should("not.exist");

    cy.tabs(3);
    cy.focused().should(
      "have.attr",
      "href",
      "/hjaelp/saadan-soeger-du-i-bibliotek.dk/1"
    );
    cy.tabs(1);
    cy.focused().should("have.attr", "href", "/hjaelp/om-login/2");
  });
  it(`Search: menu is visible on desktop`, () => {
    cy.visit("/iframe.html?path=/story/help-search--show-results");
    cy.get("[data-cy=help-menu").should("be.visible");
  });
  it(`Search: menu is hidden on mobile`, () => {
    cy.viewport(991, 800);
    cy.visit("/iframe.html?path=/story/help-search--show-results");
    cy.get("[data-cy=help-menu").should("be.hidden");
  });
});

describe("help menu", () => {
  it(`Help menu - tab & click`, () => {
    cy.visit("/iframe.html?path=/story/help-menu--help-menu");
    cy.get("[data-cy=help-menu]").should("be.visible");

    cy.tab();
    cy.focused().contains("Login");

    cy.tab();
    cy.focused().contains("Søgning");

    cy.get("[data-cy=link][tabindex=0]").should("not.be.visible");
    cy.focused().click();
    cy.get("[data-cy=link][tabindex=0]").should("be.visible");
  });
});

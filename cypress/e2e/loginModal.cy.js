describe(`Login modal`, () => {
  it("Bestil order modal renders properly", () => {
    cy.visit("iframe.html?args=&id=modal-login--login-order");
    cy.get("h2").should("have.text", "Log ind for at bestille");
    cy.get("[data-cy=link]").should(
      "have.attr",
      "href",
      "/artikel/bliv-laaner/43"
    );
  });
  it("Plain login modal enders properly", () => {
    cy.visit("iframe.html?args=&id=modal-login--login-header");
    cy.get("h2").should("have.text", "Log ind");
  });
});

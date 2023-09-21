describe(`Login not supported modal`, () => {
  it("Modal renders properly", () => {
    cy.visit("iframe.html?args=&id=modal-loginnotsupported--not-supported");
    cy.get("h2").should(
      "have.text",
      "Log ind via CBS Bibliotek understøttes ikke"
    );
    cy.get("[data-cy=why-not-supported-button]").should(
      "have.attr",
      "aria-expanded",
      "false"
    );
    cy.contains(
      "Nogle få forsknings- og uddannelsesbibliotekers systemer er ikke integereret med Bibliotek.dk, og vi vil derfor ikke kunne garantere en tværgående brugeroplevelse."
    ).should("be.not.visible");
    cy.contains("Hvorfor understøttes log ind ikke?")
      .should("be.visible")
      .click();
    cy.get("[data-cy=why-not-supported-button]").should(
      "have.attr",
      "aria-expanded",
      "true"
    );
    cy.contains(
      "Nogle få forsknings- og uddannelsesbibliotekers systemer er ikke integereret med Bibliotek.dk, og vi vil derfor ikke kunne garantere en tværgående brugeroplevelse."
    ).should("be.visible");
  });
});

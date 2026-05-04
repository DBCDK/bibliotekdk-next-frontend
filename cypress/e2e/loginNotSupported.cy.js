describe(`Login not supported modal`, () => {
  it("Modal renders properly", () => {
    const notSupportedReason =
      "Nogle få forsknings- og uddannelsesbibliotekers systemer leverer ikke data til Bibliotek.dk, og vi kan derfor ikke vise lånerstatus fra disse biblioteker.";

    cy.visit("iframe.html?args=&id=modal-loginnotsupported--not-supported");
    cy.get("h2").should(
      "have.text",
      "CBS Bibliotek-login kan ikke bruges på Bibliotek.dk"
    );
    cy.get("[data-cy=why-not-supported-button]").should(
      "have.attr",
      "aria-expanded",
      "false"
    );
    cy.contains(notSupportedReason).should("be.not.visible");
    cy.contains("Hvorfor understøttes log ind ikke?")
      .should("be.visible")
      .click();
    cy.get("[data-cy=why-not-supported-button]").should(
      "have.attr",
      "aria-expanded",
      "true"
    );
    cy.contains(notSupportedReason).should("be.visible");
  });
});

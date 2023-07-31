describe(`Login not supported modal`, () => {
  it("Modal renders properly and back button works", () => {
    cy.visit("iframe.html?args=&id=modal-loginnotsupported--not-supported");
    cy.get("h2").should(
      "have.text",
      "Log ind via CBS Bibliotek understøttes ikke"
    );
    cy.contains("Hvorfor understøttes log ind ikke?")
      .should("be.visible")
      .click();
  });
});

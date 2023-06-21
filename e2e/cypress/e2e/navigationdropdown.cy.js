describe("Dropdown navigation on small screens", () => {
  beforeEach(() => {
    cy.viewport(550, 750);
    cy.visit("/iframe.html?id=base-navigationdropdown--dropdown");
  });

  it("should show the profile menu", () => {
    cy.get('[data-cy="menu-title"]').contains("Profilmenu").click();
    cy.get('[data-cy="mobile-link-myLibraries"]').click();
    cy.get('[data-cy="mobile-link-myLibraries"]')
      .parent()
      .should("have.css", "background-color", "rgb(51, 51, 255)");
    cy.get('[data-cy="mobile-link-myLibraries"]').should(
      "have.attr",
      "href",
      "/profil/mine-biblioteker"
    );
    cy.get('[data-cy="mobile-link-myLibraries"]').click();
    cy.get(".dropdown-nav").should("not.be.visible");
  });
});

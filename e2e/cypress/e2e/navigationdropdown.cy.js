describe("Dropdown navigation on small screens", () => {
  beforeEach(() => {
    cy.viewport(550, 750);
    cy.visit("/iframe.html?id=base-navigationdropdown--dropdown");
  });

  it("should show the profile menu", () => {
    cy.get('[data-cy="menu-title"]').contains("Profilmenu").click();
    cy.get('[data-cy="mobile-link-myLibraries"]').click();
    cy.get('[data-cy="mobile-link-myLibraries"]').should(
      "have.css",
      "background-color",
      "rgb(242, 242, 242)"
    );
    cy.get('[data-cy="mobile-link-myLibraries"]').should(
      "have.attr",
      "href",
      "/profil/mine-biblioteker"
    );
  });

  it("close profile menu on outside click", () => {
    cy.get('[data-cy="menu-title"]').contains("Profilmenu").click();
    cy.get("body").click(0, 0);
    cy.get("mobile-menu").should("not.exist");
  });

  it("close profile menu on escape key", () => {
    cy.get('[data-cy="menu-title"]').contains("Profilmenu").click();
    cy.get("body").type("{esc}");
    cy.get('[data-cy="mobile-menu"').should("not.exist");
  });
});

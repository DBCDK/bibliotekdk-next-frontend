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
      "/mine-biblioteker"
    );
  });

  it("close dropdown when clicking on selected item", () => {
    cy.get('[data-cy="menu-title"]').contains("Profilmenu").click();
    // click twice, since redirect is not triggered and thus page doesnt reload with new closed menu
    cy.get('[data-cy="mobile-link-myLibraries"]').click().click();
    cy.contains("ul").should("not.be.visible");
  });

  it("close profile menu on outside click", () => {
    cy.get('[data-cy="menu-title"]').contains("Profilmenu").click();
    cy.get("body").click(0, 0);
    cy.contains("ul").should("not.be.visible");
  });

  it("close profile menu on escape key", () => {
    cy.get('[data-cy="menu-title"]').contains("Profilmenu").click();
    cy.get("body").type("{esc}");
    cy.contains("ul").should("not.be.visible");
  });
});

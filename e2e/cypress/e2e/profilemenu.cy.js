describe("Profilemenu on desktop", () => {
  it(`User with debt: GroupLink opens subcategories and they are clickable`, () => {
    cy.visit("/iframe.html?id=profile-profilemenu--profile-menu-story");
    cy.get('[data-cy="group-menu-loansAndReservations"]')
      .should("be.visible")
      .click();
    cy.get('[data-cy*="menu-subcategory"]').should("have.length", 3);
    cy.get('[data-cy="menu-subcategory-0"]').should("be.visible");
  });

  it(`User without debt: GroupLink opens subcategories and they are clickable`, () => {
    cy.visit(
      "/iframe.html?id=profile-profilemenu--profile-menu-story-without-debt"
    );
    cy.get('[data-cy="group-menu-loansAndReservations"]')
      .should("be.visible")
      .click();
    cy.get('[data-cy*="menu-subcategory"]').should("have.length", 2);
    cy.get('[data-cy="menu-subcategory-0"]').should("be.visible").click();
  });

  it(`Simple link has href`, () => {
    cy.visit("/iframe.html?id=profile-profilemenu--profile-menu-story");
    cy.get('[data-cy="menu-fixed-links"]')
      .should("be.visible")
      .should("have.attr", "href")
      .and("include", "/profil/mine-biblioteker");
  });
});

describe("Profilemenu on desktop", () => {
  it(`User with debt: GroupLink 3 links. Link is bold after onclick`, () => {
    cy.visit("/iframe.html?id=profile-profilemenu--profile-menu-story");
    cy.get('[data-cy="group-menu-loansAndReservations"]')
      .should("be.visible")
      .click();
    cy.get("#navigation-loansAndReservations")
      .should("be.visible")
      .should("have.css", "font-family", "ibm_plex_serifmedium");
    cy.get('[data-cy*="menu-subcategory"]').should("have.length", 3);
    cy.get('[data-cy="menu-subcategory-0"]').should("be.visible");
  });

  it(`User without debt: GroupLink opens subcategories. Links are clickable and change to bold on click`, () => {
    cy.visit(
      "/iframe.html?id=profile-profilemenu--profile-menu-story-without-debt"
    );
    cy.get('[data-cy="group-menu-loansAndReservations"]')
      .should("be.visible")
      .click();
    cy.get('[data-cy*="menu-subcategory"]').should("have.length", 2);
    cy.get('[data-cy="menu-subcategory-0"]')
      .should("be.visible")
      .click()
      .children()
      .first()
      .should("have.css", "font-family", "ibm_plex_sansregular");
  });

  it(`Simple link has href and is bold after on click`, () => {
    cy.visit("/iframe.html?id=profile-profilemenu--profile-menu-story");
    cy.get('[data-cy="menu-fixed-links-myLibraries"]')
      .should("be.visible")
      .should("have.attr", "href")
      .and("include", "/profil/mine-biblioteker");
    cy.get('[data-cy="menu-fixed-links-myLibraries"]')
      .click()
      .children()
      .first()
      .should("have.css", "font-family", "ibm_plex_serifmedium");
  });
});

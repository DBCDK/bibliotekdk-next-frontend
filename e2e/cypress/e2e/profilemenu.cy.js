describe("Profilemenu", () => {
  it(`GroupLink opens subcategories and they are clickable`, () => {
    cy.visit("/iframe.html?id=profile-profilemenu--profile-menu-story");

    cy.get('[data-cy="group-menu-loansAndReservations"]')
      .should("exist")
      .click();

    cy.get('[data-cy*="menu-subcategory"]').should("have.length", 3);
    cy.get('[data-cy="menu-subcategory-0"]').should("exist");

    cy.get('[data-cy="menu-subcategory-0"]')
      .should("exist")
      .should("have.attr", "href")
      .and("include", "#mellemvaerende");

    //check number of items in subcategory
  });

  it(`GroupLink opens subcategories and they are clickable`, () => {
    cy.visit("/iframe.html?id=profile-profilemenu--profile-menu-story");

    cy.get('[data-cy="menu-fixed-links"]')
      .should("exist")
      .should("have.attr", "href")
      .and("include", "/profil/mine-biblioteker");
  });
});

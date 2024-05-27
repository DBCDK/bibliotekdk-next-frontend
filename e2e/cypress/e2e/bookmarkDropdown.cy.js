describe("Dropdown", () => {
  it(`Bookmark is shown`, () => {
    cy.visit("/iframe.html?id=work-overview-bookmark--bookmark-with-dropdown");

    // test toggle
    cy.get('[data-cy="bookmark-material-selector-dropdown"]').should(
      "not.be.exist"
    );
    // click bookmark
    cy.get('[data-cy="bookmark-material-selector"]')
      .should("be.visible")
      .click();

    // check dropdown
    cy.get('[data-cy="bookmark-material-selector-dropdown"]').should(
      "be.visible"
    );

    // when  nothing is bookmarked background-color is white
    cy.get('[data-cy="bookmark-material-selector"]').should(
      "have.css",
      "background-color",
      "rgba(0, 0, 0, 0)"
    );

    // select a material
    cy.get('[data-cy="bookmark-Fisk-2"]')
      .should("be.visible")
      .click()
      .type("{esc}");

    cy.verifyMatomoEvent([
      "trackEvent",
      "Huskeliste",
      "Tilføj",
      "Some title (Fisk)",
    ]);

    // background color should be blue now
    cy.get('[data-cy="bookmark-button"] ').should(
      "have.css",
      "background-color",
      "rgb(51, 51, 255)"
    );

    // remove a material
    cy.get('[data-cy="bookmark-material-selector"]')
      .should("be.visible")
      .click();
    cy.get('[data-cy="bookmark-Fisk-2"]')
      .should("be.visible")
      .click()
      .type("{esc}");

    cy.verifyMatomoEvent([
      "trackEvent",
      "Huskeliste",
      "Fjern",
      "Some title (Fisk)",
    ]);
  });
});

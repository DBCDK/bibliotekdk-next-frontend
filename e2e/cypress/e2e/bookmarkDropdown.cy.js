describe("Dropdown", () => {
  it(`Bookmark is shown`, () => {
    cy.visit("/iframe.html?id=work-overview-bookmark--bookmark-with-dropdown");

    cy.window().then((win) => {
      win.localStorage.setItem("bookmarks", "[]");
    });

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
    cy.get('[data-cy="bookmark-fisk-2"]').should("be.visible").click();

    // background color should be blue now
    cy.get('[data-cy="bookmark-button"] i svg path').should(
      "have.css",
      "fill",
      "rgb(51, 51, 255)"
    );
  });
});

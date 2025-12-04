describe.skip("Combine search", () => {
  it(`should display error message if there are too many queries selected`, () => {
    cy.visit(
      "/iframe.html?id=advancedsearch-combined-search--too-many-selected-queries"
    );

    cy.get('[data-cy="combine-search-error-box"]').should("exist");
  });

  it(`should display info message if no queries are selected`, () => {
    cy.visit(
      "/iframe.html?id=advancedsearch-combined-search--no-queries-selected"
    );

    cy.get('[data-cy="combined-search-no-queries-selected"]').should("exist");
  });
});

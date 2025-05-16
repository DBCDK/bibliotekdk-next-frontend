describe("simpleFacets", () => {
  it(`check simple facets`, () => {
    cy.visit("/iframe.html?id=search-facets--default");
    // // there should be 2 accordions in this story
    cy.get("[data-cy=accordion-item]").should("have.length", 2); // get the first accordion
    cy.get("[data-cy=accordion-item]").first().click().wait(100);

    // assert that numbers (facet-score) are NOT in page .. yet
    cy.get("[data-cy=facet-score]").should("not.exist");
  });
});

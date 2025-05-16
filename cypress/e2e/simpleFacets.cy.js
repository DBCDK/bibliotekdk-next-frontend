describe("simpleFacets", () => {
  it(`check simple facets`, () => {
    cy.visit("/iframe.html?id=search-facets--default");
    // // there should be 2 accordions in this story
    cy.get("[data-cy=accordion-item]").should("have.length", 2); // get the first accordion
    cy.get("[data-cy=accordion-item]").first().click().wait(100);

    // assert that numbers (facet-score) are NOT in page .. yet
    cy.get("[data-cy=facet-score]").should("not.exist");
  });

  it("check url", () => {
    cy.visit("/iframe.html?id=search-facets--simple-facets-in-url");
    cy.get("[data-cy=accordion-item]").first().click().wait(100);

    // assert that numbers (facet-score) are NOT in page .. yet
    cy.get("[data-cy=facet-score]").should("not.exist");

    // click an  item and verify url is updated
    cy.get("[data-cy=accordion-item]").contains("bog").click();

    // parse the query - first accordion is materialtypespecific
    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const selected = fisk.materialTypesSpecific;
      assert(selected.includes("bog"), "query includes bog");
    });
  });
});

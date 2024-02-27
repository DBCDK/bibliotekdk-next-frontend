describe("Facets", () => {
  it(`Get facets from url`, () => {
    cy.visit("/iframe.html?id=advancedsearch-facets--facets-in-url");

    // there should be 3 accordions in this story
    cy.get("[data-cy=accordion-item]").should("have.length", 4);

    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const facets = JSON.parse(fisk.facets);

      // there should be two in query
      expect(facets.length).to.equal(2);
    });

    // get the first accordion
    cy.get("[data-cy=accordion-item]").first().click();

    // there should be 10
    cy.get("[data-cy=accordion-item]")
      .first()
      .find("li")
      .should("have.length", 10);

    // two of them should be selected from url params
    cy.get("[data-cy=accordion-item]")
      .eq(2)
      .click()
      .find("li")
      .find("[checked]")
      .should("have.length", 2);

    // uncheck one
    cy.get("[data-cy=accordion-item]")
      .eq(2)
      .find("li")
      .find("[checked]")
      .first()
      .focus()
      .click({ force: true });

    // click an item and verify url is updated
    cy.get("[data-cy=li-specificmaterialtype-artikel]")
      .find("input")
      .click({ force: true });

    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const facets = fisk.facets;
      console.log(facets, "FACETS");

      assert(facets.includes("artikel"));
    });

    // and again
    cy.get("[data-cy=li-specificmaterialtype-aarbog]")
      .find("input")
      .click({ force: true });

    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const facets = fisk.facets;

      assert(facets.includes("aarbog"));
    });
  });
});

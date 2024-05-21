describe("Facets", () => {
  it(`Get facets from url`, () => {
    cy.visit("/iframe.html?id=advancedsearch-facets--facets-in-url");

    // there should be 3 accordions in this story
    cy.get("[data-cy=accordion-item]").should("have.length", 5);

    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const facets = JSON.parse(fisk.facets);

      // there should be two in query
      expect(facets.length).to.equal(2);
    });

    // get the first accordion
    cy.get("[data-cy=accordion-item]").first().click();

    // there should be 5
    cy.get("[data-cy=accordion-item]")
      .first()
      .find("li")
      .should("have.length", 5);

    // node and e-bog should be selected from url params
    cy.get("[data-cy=accordion-item]")
      .eq(0)
      .find("li")
      .find("[checked]")
      .should("have.length", 2);

    // uncheck ebog
    cy.get("[data-cy=accordion-item]").contains("e-bog").click();

    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const facets = fisk.facets;
      assert(!facets.includes("e-bog"), "E-bog is removed from url");
      assert(!facets.includes("artikel"), "Artikel is not in url");
    });

    // click an artikel item and verify url is updated
    cy.get("[data-cy=accordion-item]").contains("artikel").click();

    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const facets = fisk.facets;
      assert(facets.includes("artikel"), "Url includes artikel");
    });

    // and again
    cy.get("[data-cy=accordion-item]").contains("bog").click();

    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const facets = fisk.facets;
      assert(facets.includes("bog"), "Url includes bog");
    });
  });
});

describe("Advanced search history", () => {
  it(`test Cql history`, () => {
    cy.visit("/iframe.html?id=search-avanceret-searchhistory--default");

    cy.get("[data-cy=advanced-search-search-history]")
      .should("exist")
      .contains("Søgehistorik");

    // list should NOT be shown as default
    cy.get("div[class=card-body").should("not.be.visible");

    // now click to make it visible
    cy.get("[data-cy=advanced-search-search-history]").should("exist").click();
    // there should be 2 items in list
    cy.get("div[class=card-body] div")
      .should("be.visible")
      .should("have.length", 2);

    // test delete function
    cy.get("[data-cy=delete-history-0]").click();
    cy.get("div[class=card-body] div")
      .should("be.visible")
      .should("have.length", 1);
  });
});

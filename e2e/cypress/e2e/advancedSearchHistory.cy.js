describe("Advanced search history", () => {
  it(`test Cql history`, () => {
    cy.visit("/iframe.html?id=search-avanceret-searchhistory--default");

    cy.get("[data-cy=advanced-search-search-history]")
      .should("exist")
      .contains("Seneste søgninger");

    // now click to make it visible
    cy.get("[data-cy=advanced-search-history-item]").should("exist");
    // there should be 2 items in list
    cy.get("[data-cy=advanced-search-history-item]")
      .should("be.visible")
      .should("have.length", 3);

    // test delete function
    cy.get("#select-item-0").should("exist").click({ force: true });

    cy.get("[data-cy=text-fjern-valgte]").should("exist").click();
    cy.get("[data-cy=advanced-search-history-item]")
      .should("be.visible")
      .should("have.length", 2);
  });
});

describe("Advanced search history", () => {
  beforeEach(() => {
    cy.visit("/iframe.html?id=search-avanceret-searchhistory--default");
  });
  it(`should display Cql history with recent searches`, () => {
    cy.get("[data-cy=advanced-search-search-history]")
      .should("exist")
      .contains("Seneste søgninger");

    cy.get("[data-cy=advanced-search-history-item]").should("exist");

    cy.get("[data-cy=advanced-search-history-item]")
      .should("be.visible")
      .should("have.length", 3);
  });

  it(`should delete a search history item`, () => {
    // test delete function
    cy.get("#select-item-0").should("exist").click({ force: true });

    cy.get("[data-cy=text-fjern-valgte]").should("exist").click();
    cy.get("[data-cy=advanced-search-history-item]")
      .should("be.visible")
      .should("have.length", 2);
  });

  it("should check select all checkbox when all items are checked", () => {
    // Check all checkboxes
    cy.get("#select-item-0").should("exist").click({ force: true });
    cy.get("#select-item-1").should("exist").click({ force: true });
    cy.get("#select-item-2").should("exist").click({ force: true });

    // Verify 'select all' checkbox is selected
    cy.get("[data-cy=advanced-search-history-selectall-checkbox]").should(
      "be.checked"
    );
  });

  it("should be able to select all and remove all using select all checkbox", () => {
    // click on 'select all' checkbox
    cy.get("[data-cy=advanced-search-history-selectall-checkbox]")
      .should("exist")
      .click({ force: true });
    //it should be checked
    cy.get("[data-cy=advanced-search-history-selectall-checkbox]").should(
      "be.checked"
    );

    // verify all individual checkboxes are checked
    cy.get("#select-item-0").should("be.checked");
    cy.get("#select-item-1").should("be.checked");
    cy.get("#select-item-2").should("be.checked");

    //click on select all to uncheck
    cy.get("[data-cy=advanced-search-history-selectall-checkbox]")
      .should("exist")
      .click({ force: true });

    // verify select all checkbox is unchecked
    cy.get("[data-cy=advanced-search-history-selectall-checkbox]").should(
      "not.be.checked"
    );

    // verify all individual checkboxes are unchecked
    cy.get("#select-item-0").should("not.be.checked");
    cy.get("#select-item-1").should("not.be.checked");
    cy.get("#select-item-2").should("not.be.checked");
  });
});

describe("Advanced Search Visibility Test", () => {
  it("should display advanced search on clicking the trigger", () => {
    cy.visit("/iframe.html?id=advancedsearch-popover--default");
    cy.get('[data-cy="advanced-search-popover"]').should("not.be.visible");

    cy.get('[data-cy="advanced-search-trigger"]').click();

    cy.get('[data-cy="advanced-search-popover"]').should("be.visible");
  });

  it("should close advanced search popover when close button is clicked", () => {
    cy.visit("/iframe.html?id=advancedsearch-popover--default");
    cy.get('[data-cy="advanced-search-trigger"]').click();
    cy.get('[data-cy="advanced-search-popover"]').should("be.visible");
    cy.get('[data-cy="advanced-search-close-button"]').click();
    cy.get('[data-cy="advanced-search-popover"]').should("not.be.visible");
  });
});

describe("Field search", () => {
  //   -man kan lave en søgning med alle felter
  //   -man kan tilføje og fjerne felter
  //   -tjek og, eller, ikke dropdown
  //   -fjerne input field
});

describe("General", () => {
  //   -man kan rydde søgning
  //   -man kan redigere feltsøgning som CQL
  //   -man kan lave CQL søgning
});

describe("Advanced Search Visibility Test", () => {
  it.skip("should display advanced search on clicking the trigger", () => {
    cy.visit("/iframe.html?id=advancedsearch-popover--default");
    cy.get('[data-cy="advanced-search-popover"]').should("not.be.visible");

    cy.get('[data-cy="advanced-search-trigger"]').click();

    cy.get('[data-cy="advanced-search-popover"]').should("be.visible");
  });

  it.skip("should close advanced search popover when close button is clicked", () => {
    cy.visit("/iframe.html?id=advancedsearch-popover--default");
    cy.get('[data-cy="advanced-search-trigger"]').click();
    cy.get('[data-cy="advanced-search-popover"]').should("be.visible");
    cy.get('[data-cy="advanced-search-close-button"]').click();
    cy.get('[data-cy="advanced-search-popover"]').should("not.be.visible");
  });
});

//   -man kan lave en søgning med alle felter
//   -man kan tilføje og fjerne felter
//   -tjek og, eller, ikke dropdown
//   -fjerne input field

describe("Text Inputs Component Test", () => {
  beforeEach(() => {
    cy.visit("/iframe.html?id=advancedsearch-fieldinput--text-inputs-story");
  });

  it("should add a new input field on clicking the add button", () => {
    cy.get('[data-cy="advanced-search-add-input"]').click();
    cy.get('[datacy="advanced-search-inputfield-2"]').should("exist");
  });

  it("should remove an input field on clicking the remove button", () => {
    // cy.get('[data-cy="advanced-search-add-input"]').click();
    cy.get('[datacy="advanced-search-inputfield-1"]').should("exist");

    cy.get('[data-cy="advanced-search-remove-input"]').last().click();

    cy.get('[datacy="advanced-search-inputfield-1"]').should("not.exist");
    //cy.get('[data-cy^="advanced-search-inputfield-"]').should('have.length', 1);
  });

  it.skip("should change logical operator between input fields", () => {
    //todo
    //  cy.get('[data-cy="advanced-search-add-input"]').click();

    cy.get('[data-cy="advanced-search-logical-operator-dropDown"]').click();

    cy.get('[data-cy="advanced-search-logical-operator-dropDown-OR"]').click();

    cy.get('[data-cy="advanced-search-logical-operator-dropDown"]')
      .eq(1)
      .should("contain", "OR");
  });
});

describe("General", () => {
  //   -man kan rydde søgning
  //   -man kan redigere feltsøgning som CQL
  //   -man kan lave CQL søgning
});

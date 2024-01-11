describe("Popover elements", () => {
  beforeEach(() => {
    cy.visit("/iframe.html?id=advancedsearch-popover--default");
  });

  it("should display advanced search on clicking the trigger", () => {
    cy.get('[data-cy="advanced-search-popover"]').should("not.be.visible");

    cy.get('[data-cy="advanced-search-trigger"]').click();

    cy.get('[data-cy="advanced-search-popover"]').should("be.visible");
  });

  it("should close advanced search popover when close button is clicked", () => {
    cy.get('[data-cy="advanced-search-trigger"]').click();
    cy.get('[data-cy="advanced-search-popover"]').should("be.visible");
    cy.get('[data-cy="advanced-search-close-button"]').click();
    cy.get('[data-cy="advanced-search-popover"]').should("not.be.visible");
  });

  it("should clear all input fields on clicking the clear search link", () => {
    cy.get('[data-cy="advanced-search-trigger"]').click();

    cy.get('[datacy="advanced-search-inputfield-0"]')
      .find("input")
      .type(`Hej med dig `)
      .blur();
    cy.get('[datacy="advanced-search-inputfield-1"]')
      .find("input")
      .type(`Jeg hedder kaj`)
      .blur();

    cy.get('[data-cy="advanced-search-clear-search"]').click();

    cy.get('[datacy="advanced-search-inputfield-0"]')
      .find("input")
      .should("have.value", "");
    cy.get('[datacy="advanced-search-inputfield-1"]')
      .find("input")
      .should("have.value", "");
  });

  it("should be able to ses parsed inputfield search in the cql editor", () => {
    const expectedParsedString =
      '(term.title="Mord i Mesopotamien" AND term.subject="Krimi")';
    cy.get('[data-cy="advanced-search-trigger"]').click();
    //set first input field to have search index term.title and value hej med dig
    cy.get('[data-cy="advanced-search-index-dropdown-0"]').click();
    cy.get('[data-cy="item-term.title"]').click();
    cy.get('[datacy="advanced-search-inputfield-0"]')
      .find("input")
      .type(`Mord i Mesopotamien`)
      .blur();

    //set second input field to have search index term.subject and value krimi
    cy.get('[data-cy="advanced-search-index-dropdown-1"]').click();
    cy.get('[data-cy="item-term.subject"]:visible').click();
    cy.get('[datacy="advanced-search-inputfield-1"]')
      .find("input")
      .type(`Krimi`)
      .blur();

    cy.get('[data-cy="edit-in-cql"]').click();

    cy.get('[data-cy="advanced-search-cqltxt"]').should(
      "have.value",
      expectedParsedString
    );
  });

  it("should clear textinput", () => {
    cy.get('[data-cy="advanced-search-trigger"]').click();
    cy.get('[data-cy="edit-in-cql"]').click();
    const testString = "Hej med dig jeg hedder kaj";

    cy.get('[data-cy="advanced-search-cqltxt"]').type(testString);

    cy.get('[data-cy="advanced-search-cqltxt"]').should(
      "have.value",
      testString
    );
    cy.get('[data-cy="advanced-search-clear-search"]').click();

    cy.get('[data-cy="advanced-search-cqltxt"]').should("have.value", "");
  });
});

describe("TextInputs test", () => {
  beforeEach(() => {
    cy.visit("/iframe.html?id=advancedsearch-fieldinput--text-inputs-story");
  });

  it("should add a new input field on clicking the add button", () => {
    cy.get('[datacy="advanced-search-inputfield-2"]').should("not.exist");
    cy.get('[data-cy="advanced-search-add-input"]').click();
    cy.get('[datacy="advanced-search-inputfield-2"]').should("exist");
  });

  it("should remove an input field on clicking the remove button", () => {
    // cy.get('[data-cy="advanced-search-add-input"]').click();
    cy.get('[datacy="advanced-search-inputfield-1"]').should("exist");

    cy.get('[data-cy="advanced-search-remove-input"]').last().click();

    cy.get('[datacy="advanced-search-inputfield-1"]').should("not.exist");
  });

  it("should change logical operator between input fields", () => {
    cy.get('[data-cy="advanced-search-logical-operator-dropDown"]').click();

    cy.get('[data-cy="advanced-search-logical-operator-dropDown-AND"]').click();

    cy.get('[data-cy="advanced-search-logical-operator-dropDown"]').should(
      "contain",
      "OG"
    );
  });
});

describe("Dropdowns test", () => {
  //Todo: implement when dropdowns has been refactored
  beforeEach(() => {
    cy.visit(
      "/iframe.html?id=advancedsearch-dropdownitems--dropdown-items-base"
    );
  });

  it("should select items from a checkbox dropdown", () => {});

  it("should reset dropdown", () => {});
  it("search inside a dropdown", () => {});
  it("should select year range ", () => {});
  it("should select age range ", () => {});
});

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
    //open advanced search
    cy.get('[data-cy="advanced-search-trigger"]').click();
    //assert that the popver is visible

    cy.get('[data-cy="advanced-search-popover"]').should("be.visible");
    //close the popover
    cy.get('[data-cy="advanced-search-close-button"]').click();
    //assert that the popver is not visible
    cy.get('[data-cy="advanced-search-popover"]').should("not.be.visible");
  });

  it("should clear all input fields on clicking the clear search link", () => {
    cy.get('[data-cy="advanced-search-trigger"]').click();
    //type something in the first inputfield
    cy.get('[datacy="advanced-search-inputfield-0"]')
      .find("input")
      .type(`Hej med dig `)
      .blur();
    //type something in the second inputfield

    cy.get('[datacy="advanced-search-inputfield-1"]')
      .find("input")
      .type(`Jeg hedder kaj`)
      .blur();
    //clear the fields
    cy.get('[data-cy="advanced-search-clear-search"]').click();
    //assert that the values has been cleared
    cy.get('[datacy="advanced-search-inputfield-0"]')
      .find("input")
      .should("have.value", "");
    cy.get('[datacy="advanced-search-inputfield-1"]')
      .find("input")
      .should("have.value", "");
  });

  it("should be able to see parsed inputfield search in the cql editor", () => {
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
    //swith to cql editor and assert that it has the correct paresd value
    cy.get('[data-cy="edit-in-cql"]').click();

    cy.get('[data-cy="advanced-search-cqltxt"]').should(
      "have.value",
      expectedParsedString
    );
  });

  it("should clear cql editor input", () => {
    cy.get('[data-cy="advanced-search-trigger"]').click();
    cy.get('[data-cy="edit-in-cql"]').click();

    //type something in cql text area
    const testString = "Hej med dig jeg hedder kaj";
    cy.get('[data-cy="advanced-search-cqltxt"]').type(testString);
    cy.get('[data-cy="advanced-search-cqltxt"]').should(
      "have.value",
      testString
    );
    //clear textarea
    cy.get('[data-cy="advanced-search-clear-search"]').click();
    // assert that the textara has been cleared
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

  it("should select items from a checkbox dropdown", () => {
    //click on materialtype dropdown
    cy.get(
      '[data-cy="advanced-search-dropdown-phrase.generalmaterialtype"]'
    ).click();
    //select books,movies and music
    cy.get('[data-cy="list-button-0"]').click();
    cy.get('[data-cy="list-button-1"]').click();
    cy.get('[data-cy="list-button-2"]').click();

    //expect dropdown label should have value 3
    cy.get(
      '[data-cy="dropdown-selected-count-phrase.generalmaterialtype"]'
    ).should("have.text", "3");
  });
  it("search inside a dropdown", () => {
    cy.get(
      '[data-cy="advanced-search-dropdown-phrase.generalmaterialtype"]'
    ).click();

    cy.get('[data-cy="dropdown-searchbar-Materialetype"]').type("tegneserier");
    cy.get('[data-cy="list-button-0"] [data-cy="text-tegneserier"]').should(
      "have.text",
      "tegneserier"
    );
  });

  it("should select year range ", () => {
    //open publication year dropdown
    cy.get('[data-cy="advanced-search-dropdown-publicationyear"]').click();
    //type in from input
    cy.get('[data-cy="advanced-search-from-range"]').type(1948);
    //type in to input

    cy.get('[data-cy="advanced-search-to-range"]').type(1984);
    //expect it to be shown in the dropdown label
    cy.get('[data-cy="advanced-search-dropdown-selected-label"]').should(
      "have.text",
      "1948 - 1984"
    );
  });
  it("should reset dropdown", () => {
    //open ages modal
    cy.get('[data-cy="advanced-search-dropdown-ages"]').click();
    //click on 3-6 years option
    cy.get('[data-cy="text-for-3-6-årige"]').click();
    //Expect that it is shown in the label as selected
    cy.get('[data-cy="advanced-search-dropdown-selected-label"]').should(
      "have.text",
      "3-6-årige"
    );
    //clear selection
    cy.get('[data-cy="advanced-search-dropdown-clear"]').click();
    //dropdown label should not exist
    cy.get('[data-cy="advanced-search-dropdown-selected-label"]').should(
      "not.exist"
    );
  });
});

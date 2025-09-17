describe("Popover elements", () => {
  beforeEach(() => {
    cy.visit("/iframe.html?id=advancedsearch-popover--default");
  });

  it("should display advanced search on clicking the trigger", () => {
    cy.get('[data-cy="advanced-search-popover"]').should("not.be.visible");
    cy.get('[data-cy="advanced-search-trigger"]').click();
    cy.get('[data-cy="advanced-search-popover"]').should("be.visible");
  });

  it("should clear all input fields on clicking the clear search link", () => {
    cy.get('[data-cy="advanced-search-trigger"]').click();

    cy.get('[data-cy="advanced-search-add-input"]').click();

    //type something in the first inputfield
    cy.get('[data-cy="advanced-search-inputfield-0"]')
      .type(`Hej med dig `)
      .blur();

    //type something in the second inputfield
    cy.get('[data-cy="advanced-search-inputfield-1"]')
      .focus()
      .type(`Jeg hedder kaj`)
      .blur();
    //clear the fields
    cy.get('[data-cy="advanced-search-clear-search"]').click();
    //assert that the values has been cleared
    cy.get('[data-cy="advanced-search-inputfield-0"]').should("have.value", "");
  });

  // skipped for now, saved for later, when new search is implemented
  it.skip("should be able to see parsed inputfield search in the cql editor", () => {
    const expectedParsedString =
      '(term.title="Mord i Mesopotamien" AND term.subject="Krimi")';

    cy.get('[data-cy="advanced-search-trigger"]').click();
    //set first input field to have search index term.title and value hej med dig
    cy.get('[data-cy="advanced-search-index-dropdown-0"]').click();
    cy.get('[data-cy="item-term.title"]').click();
    cy.get('[data-cy="advanced-search-inputfield-0"]')
      .type(`Mord i Mesopotamien`)
      .blur();

    cy.get('[data-cy="advanced-search-add-input"]').click();

    //set second input field to have search index term.subject and value krimi
    cy.get('[data-cy="advanced-search-index-dropdown-1"]').click();
    cy.get('[data-cy="item-term.subject"]:visible').click();
    cy.get('[data-cy="advanced-search-inputfield-1"]').type(`Krimi`).blur();
    //swith to cql editor and assert that it has the correct paresd value
    cy.get("#Tabs-tab-cql").click();

    cy.get('[data-cy="advanced-search-cqltxt"] textarea').should(
      "have.value",
      expectedParsedString
    );

    // assert that helplink to search code is displayed
    cy.get('a[href="https://fbi-api.dbc.dk/indexmapper/"]').should("exist");
    // helplink should NOT be displayed in fieldsearch
    // switch back to fieldeditor
    cy.get('[data-cy="edit-in-cql"]').click();
    cy.get('a[href="https://fbi-api.dbc.dk/indexmapper/"]').should("not.exist");
  });

  // skipped for now, saved for later, when new search is implemented
  it.skip("should clear cql editor input", () => {
    cy.get('[data-cy="advanced-search-trigger"]').click();
    cy.get('[data-cy="edit-in-cql"]').click();

    //type something in cql text area
    const testString = "Hej med dig jeg hedder kaj";
    cy.get('[data-cy="advanced-search-cqltxt"] textarea').type(testString);
    cy.get('[data-cy="advanced-search-cqltxt"] textarea').should(
      "have.value",
      testString
    );
    //clear textarea
    cy.get('[data-cy="advanced-search-clear-search"]').click();
    // assert that the textara has been cleared
    cy.get('[data-cy="advanced-search-cqltxt"] textarea').should(
      "have.value",
      ""
    );
  });

  it("should handle percent characters in search without throwing exceptions", () => {
    const testString = "11%";
    
    cy.get('[data-cy="advanced-search-trigger"]').click();
    
    // Type the problematic string with % character
    cy.get('[data-cy="advanced-search-inputfield-0"]')
      .type(testString)
      .blur();

    // Click search button to verify no exception is thrown
    cy.get('[data-cy="button-søg-avanceret"]').click();
  });
});

describe("TextInputs test", () => {
  beforeEach(() => {
    cy.visit("/iframe.html?id=advancedsearch-fieldinput--text-inputs-story");
  });

  it("should add a new input field on clicking the add button", () => {
    cy.get('[data-cy="advanced-search-inputfield-1"]').should("not.exist");
    cy.get('[data-cy="advanced-search-add-input"]').click();
    cy.get('[data-cy="advanced-search-inputfield-1"]').should("exist");
  });

  it("should remove an input field on clicking the remove button", () => {
    cy.get('[data-cy="advanced-search-inputfield-0"]').should("exist");
    cy.get('[data-cy="advanced-search-inputfield-1"]').should("not.exist");

    cy.get('[data-cy="advanced-search-add-input"]').click();

    cy.get('[data-cy="advanced-search-inputfield-1"]').should("exist");
    cy.get('[data-cy="advanced-search-remove-input"]').last().click();

    cy.get('[data-cy="advanced-search-inputfield-1"]').should("not.exist");
  });

  it("should change logical operator between input fields", () => {
    cy.get('[data-cy="advanced-search-add-input"]').click();

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
    cy.get('[data-cy="advanced-search-dropdown-phrase.mainlanguage"]').click();
    //select books,movies and music
    cy.get('[data-cy="list-button-0"]').click();
    cy.get('[data-cy="list-button-1"]').click();
    cy.get('[data-cy="list-button-2"]').click();

    //expect dropdown label should have value 3
    cy.get('[data-cy="dropdown-selected-count-phrase.mainlanguage"]').should(
      "have.text",
      "3"
    );
  });
  it("search inside a dropdown", () => {
    cy.get('[data-cy="advanced-search-dropdown-phrase.mainlanguage"]').click();

    cy.get('[data-cy="dropdown-searchbar-Sprog"]').type("dansk");
    cy.get('[data-cy="list-button-0"] [data-cy="text-dansk"]').should(
      "have.text",
      "dansk"
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
    //show all dropdowns:
    cy.get('[data-cy="advanced-search-dropdowns-show-more"]').click();
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

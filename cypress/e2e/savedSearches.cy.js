describe("Advanced search history", () => {
  beforeEach(() => {
    cy.visit("/iframe.html?id=advancedsearch-savedsearches--default");
  });
  it(`should display saved searches`, () => {
    cy.get("[data-cy=searchHistory-navigation-saved-search]")
      .should("exist")
      .contains("Gemte søgninger (4)");

    cy.get("[data-cy=saved-searches-accordion")
      .should("exist")
      .children()
      .should("have.length", 4);
  });
  it("Should be able to expand an accordion", () => {
    //no accordion
    cy.get("[data-cy=accordion-expanded-content-1]").should("not.be.visible");
    //click on first accordion
    cy.get("[data-cy=saved-searches-accordion]").children().first().click();

    cy.get("[data-cy=accordion-expanded-content-1]").should("be.visible");
  });

  it("should check all checkboxes when select all is clicked", () => {
    cy.wait(600);
    //click select all
    cy.get("[data-cy=advanced-search-history-selectall-checkbox]")
      .should("exist")
      .click({ force: true });

    //all elements should be checked
    cy.get("[data-cy=checkbox]")
      .should("have.length", 4)
      .each(($checkbox) => {
        cy.wrap($checkbox).should("be.checked");
      });
  });
});

describe("Advanced search history without login", () => {
  it("should not display saved searches for unauthenticated users", () => {
    cy.visit("/iframe.html?id=advancedsearch-savedsearches--no-authenticated");

    //saved searches section does not exist
    cy.get("[data-cy=searchHistory-navigation-saved-search]").should(
      "not.exist"
    );

    //login button exists
    cy.get("[data-cy=saved-search-login-button]").should("exist");
  });
});
//test for not logged in user

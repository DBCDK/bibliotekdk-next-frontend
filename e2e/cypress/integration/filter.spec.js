const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Filter", () => {
  beforeEach(function () {});

  it(`9/10 categories is visible (workType is excluded)`, () => {
    cy.visit("/iframe.html?id=modal-filter--default");

    cy.get("[data-cy=list-facets]")
      .children()
      .should("not.contain.text", "Materialekategori");
    cy.get("[data-cy=list-facets]").children().should("have.length", 9);
  });

  it(`Tab is trapped inside modal`, () => {
    cy.visit("/iframe.html?id=modal-filter--default");

    cy.tab();
    cy.focused().contains("Luk");
    cy.tabs(5);
    cy.focused().contains("Luk");
  });

  it(`Can select filters with both back-button and save-button`, () => {
    cy.visit("/iframe.html?id=modal-filter--default");

    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click();
    cy.get("[data-cy=modal-back]").click();
    cy.get("[data-cy=list-button-0]").should("contain.text", "dan, eng");

    cy.get("[data-cy=list-facets] [data-cy=list-button-3]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=button-gem]").click();
    cy.get("[data-cy=list-button-0]").should("contain.text", "krimi");
  });

  it(`Can update filters in query`, () => {
    cy.visit("/iframe.html?id=modal-filter--default");

    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click();
    cy.get("[data-cy=button-gem]").click();

    cy.get("[data-cy=list-facets] [data-cy=list-button-3]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=button-gem]").click();

    cy.get("[data-cy=vis-resultater]").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(
        `{"pathname":"/","query":{"language":"dan,eng","genre":"krimi"}}`
      );
    });
  });

  it(`Can clear all selected filters`, () => {
    cy.visit("/iframe.html?id=modal-filter--default");

    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-2]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-3]").click();
    cy.get("[data-cy=button-gem]").click();

    cy.get("[data-cy=list-facets] [data-cy=list-button-1]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-2]").click();
    cy.get("[data-cy=modal-back]").click();

    cy.get("[data-cy=clear-all-filters]").click();

    cy.get("[data-cy=vis-resultater]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`{"pathname":"/","query":{}}`);
    });
  });

  it(`Can access filters on website`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q=hest`);

    cy.get("[data-cy=view-all-filters]").click();
    cy.get("[data-cy=filter-modal]").should("be.visible");

    cy.wait(1000);

    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-2]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-3]").click();
    cy.get("[data-cy=button-gem]").click();

    cy.get("[data-cy=list-facets] [data-cy=list-button-2]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-2]").click();
    cy.get("[data-cy=button-gem]").click();

    cy.get("[data-cy=vis-resultater]").click();

    cy.get("[data-cy=view-all-filters]").should("contain.text", "(6)");
  });

  it(`Only show 4 specific filters on workType 'game'`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q=lego&workType=game`);

    cy.get("[data-cy=view-all-filters]").click();
    cy.get("[data-cy=filter-modal]").should("be.visible");

    cy.wait(1000);

    cy.get("[data-cy=list-facets]").children().should("have.length", 4);
  });
});

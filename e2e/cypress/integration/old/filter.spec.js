const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

function viewAllFilters() {
  cy.wait(1000);
  cy.get("[data-cy=view-all-filters]").click({ force: true });
  // wait for transition to end
  cy.wait(1000);
  cy.get(".modal_open").should("be.visible");
  // Wait for facets to load
  cy.contains(/vis\s*\d*\s*resultater/i);
  cy.wait(500);
}

function modalBack() {
  cy.get("[data-cy=modal-back]").click();
  // Wait for facets to load
  cy.contains(/vis\s*\d*\s*resultater/i);
  cy.wait(500);
}
describe("Filter", () => {
  beforeEach(function () {});

  it(`9/10 categories is visible (workType is excluded)`, () => {
    cy.visit("/iframe.html?id=modal-filter--default");

    cy.get("[data-cy=list-facets]")
      .children()
      .should("not.contain.text", "Materialekategori");
    cy.get("[data-cy=list-facets]").children().should("have.length", 9);
  });

  it.skip(`Tab is trapped inside modal`, () => {
    cy.visit("/iframe.html?id=modal-filter--default");
    cy.wait(1000);
    cy.tab();
    cy.focused().contains("Luk");
    cy.tabs(4);
    cy.focused().contains("Luk");
  });

  it(`Can update filters in query`, () => {
    cy.visit("/iframe.html?id=modal-filter--default");

    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click();
    modalBack();

    cy.get("[data-cy=list-facets] [data-cy=list-button-3]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    modalBack();

    cy.get("[data-cy=vis-resultater]").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal(
        `{"pathname":"/","query":{"language":"Dansk,Engelsk","genre":"krimi"}}`
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
    modalBack();

    cy.get("[data-cy=list-facets] [data-cy=list-button-1]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-2]").click();
    modalBack();

    cy.get("[data-cy=clear-all-filters]").click();

    cy.get("[data-cy=vis-resultater]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`{"pathname":"/","query":{}}`);
    });
  });

  // Der er filtre som ikke længere vil være der - skal rettes før det tages i brug i prod
  it(`Can access filters on website`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q.all=hest`);

    viewAllFilters();

    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click({
      force: true,
    });
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click({
      force: true,
    });
    cy.get("[data-cy=list-terms] [data-cy=list-button-2]").click({
      force: true,
    });
    cy.get("[data-cy=list-terms] [data-cy=list-button-3]").click({
      force: true,
    });
    modalBack();

    cy.get("[data-cy=list-facets] [data-cy=list-button-2]").scrollIntoView();
    cy.get("[data-cy=list-facets] [data-cy=list-button-2]").click({
      force: true,
    });

    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click({
      force: true,
    });
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click({
      force: true,
    });

    modalBack();

    cy.get("[data-cy=vis-resultater]").click({ force: true });

    cy.get("[data-cy=view-all-filters]").should("contain.text", "(5)");
  });

  it(`Only show 5 specific filters on workType 'game'`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q.all=lego&workType=game`);

    viewAllFilters();

    cy.get("[data-cy=list-facets]").children().should("have.length", 5);
  });

  it(`Can parse facet containing ","`, () => {
    cy.intercept("POST", "/190101/default/graphql", (req) => {
      if (req?.body?.query?.includes?.("facets")) {
        req.reply({
          data: {
            search: {
              facets: [
                {
                  name: "subject",
                  values: [{ term: "test, test", key: "test, test", count: 7 }],
                },
              ],
            },
            monitor: "OK",
          },
        });
      }
    });

    cy.visit(`${nextjsBaseUrl}/find?q.all=dronningen`);

    viewAllFilters();

    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click({
      force: true,
    });

    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click({
      force: true,
    });

    cy.get("body").type("{esc}");

    viewAllFilters();
    cy.contains("Emne");
    cy.wait(1000);

    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click({
      force: true,
    });
    cy.wait(1000);

    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").contains(
      "test, test"
    );
  });

  it(`Can clear selected filters`, () => {
    cy.visit(
      `${nextjsBaseUrl}/find?q.all=marvel&materialType=playstation+4,playstation+3,playstation+2&accessType=physical`
    );

    cy.get("[data-cy=view-all-filters]").should("contain.text", "(4)");

    cy.get("[data-cy=view-all-filters]").click({ force: true });
    cy.get("[data-cy=filter-modal]").should("be.visible");

    cy.wait(1000);
    cy.get("[data-cy=clear-all-filters]").click();

    cy.wait(500);
    cy.get("[data-cy=close-modal]").click();

    cy.get("[data-cy=view-all-filters]").should("not.contain.text", "(4)");
  });

  it(`Cleared filters will not get restored onMount`, () => {
    cy.visit(
      `${nextjsBaseUrl}/find?q.all=marvel&materialType=playstation+4,playstation+3,playstation+2&accessType=physical`
    );

    viewAllFilters();
    cy.get("[data-cy=clear-all-filters]").click();

    cy.wait(500);
    cy.get("[data-cy=close-modal]").click();
    cy.wait(500);

    cy.get("[data-cy=view-all-filters]").click({ force: true });
    cy.get("[data-cy=list-facets] [data-cy=list-button-0]").click({
      force: true,
    });
    cy.get("[data-cy=list-terms] [data-cy=list-button-2]").click({
      force: true,
    });
    modalBack();
    cy.wait(500);
    cy.get("[data-cy=vis-resultater]").click();

    cy.get("[data-cy=view-all-filters]").should("contain.text", "(1)");
  });

  it(`Clear filters on workType change`, () => {
    cy.visit(
      `${nextjsBaseUrl}/find?q.all=Batman&materialType=tegneserie&accessType=Fysisk&language=Dansk`
    );

    cy.get("[data-cy=view-all-filters]").should("contain.text", "(3)");
    cy.get("[data-cy=header-material-selector]").click();
    cy.get("[data-cy=item-movie]").click();
    cy.get("[data-cy=view-all-filters]").should("not.contain.text", "(3)");
  });

  it(`Clear filters on query change`, () => {
    cy.visit(
      `${nextjsBaseUrl}/find?q.all=Batman&materialType=tegneserie&accessType=Fysisk&language=Dansk`
    );

    cy.get("[data-cy=view-all-filters]").should("contain.text", "(3)");
    cy.get("[data-cy=suggester-input]")
      .clear()
      .type("Spiderman")
      .type("{enter}");

    cy.get("[data-cy=view-all-filters]").should("not.contain.text", "(3)");
  });

  // pjo 17/06 skip this test - simplesearch 1.2 gives a mix of materialtypes
  it(`Restore filters when browser's back button is used`, () => {
    cy.visit(
      `${nextjsBaseUrl}/find?q.all=katte&workType=article&materialType=avisartikel`
    );

    cy.log("Open and close filters modal");
    viewAllFilters();
    cy.get("[data-cy=close-modal]").click();

    cy.log("Ensure that 10 newspaper articles are on the first page");
    cy.get('a [data-cy="text-avisartikel"]').should("have.length", 10);

    cy.log("Visit article page and go back");
    cy.get('a [data-cy="text-avisartikel"]').first().click();
    cy.contains("Informationer og udgaver");
    cy.go("back");

    cy.log("We should still have 10 newspaper articles are on the first page");
    cy.get('a [data-cy="text-avisartikel"]').should("have.length", 10);
  });
});

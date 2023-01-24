const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Filter", () => {
  it(`workTypes facet is excluded from facets list`, () => {
    cy.visit("/iframe.html?id=modal-filter--connected");
    cy.get("button").contains("Open filters").click();

    cy.contains("Emne");
    cy.contains("Forfatter");

    cy.get("[data-cy=list-facets]").children().should("have.length", 2);
  });

  it(`Tab is trapped inside modal`, () => {
    cy.visit("/iframe.html?id=modal-filter--connected");
    cy.get("button").contains("Open filters").click();
    cy.wait(1000);
    cy.focused().tab();
    cy.focused().contains("Luk");
    cy.tab().tab().tab().tab();
    cy.focused().contains("Luk");
  });

  it(`Can update filters in query and sync with url`, () => {
    cy.visit("/iframe.html?id=modal-filter--connected");

    cy.get("button").contains("Open filters").click();

    // Select some subjects
    cy.contains("Emne").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click();
    cy.contains("Tilbage").click();
    cy.get("[data-cy=list-facets]").contains("krimi");

    // Select some creators
    cy.contains("Forfatter").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click();
    cy.contains("Tilbage").click();
    cy.get("[data-cy=list-facets]").contains("Jens Jensen");
    cy.get("[data-cy=list-facets]").contains("Hans Hansen");

    // Sync with url, close modal
    cy.contains("Vis resultater").click();

    cy.get("[data-cy=router-query]").then((el) => {
      expect(JSON.parse(el.text())).to.deep.equal({
        "q.all": "some query",
        subjects: "krimi",
        creators: "Jens Jensen,Hans Hansen",
      });
    });
  });

  it(`Can clear all selected filters`, () => {
    cy.visit("/iframe.html?id=modal-filter--connected");

    cy.get("button", { timeout: 10000 }).contains("Open filters").click();

    // Select some creators
    cy.contains("Forfatter").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-0]").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-1]").click();
    cy.contains("Tilbage").click();

    // Sync with url, close modal
    cy.contains("resultater").click();

    cy.get("button").contains("Open filters").click();

    // They are still selected
    cy.get("[data-cy=list-facets]").contains("Jens Jensen");
    cy.get("[data-cy=list-facets]").contains("Hans Hansen");

    cy.contains("Ryd alt").click();
    cy.get("[data-cy=list-facets]").contains("Jens Jensen").should("not.exist");
    cy.get("[data-cy=list-facets]").contains("Hans Hansen").should("not.exist");

    // Sync with url, close modal
    cy.contains("resultater").click();

    cy.get("[data-cy=router-query]").then((el) => {
      expect(JSON.parse(el.text())).to.deep.equal({
        "q.all": "some query",
      });
    });
  });

  it(`Can parse facet containing ","`, () => {
    cy.visit("/iframe.html?id=modal-filter--connected");

    cy.get("button").contains("Open filters").click();

    // Select some subjects
    cy.contains("Emne").click();
    cy.get("[data-cy=list-terms] [data-cy=list-button-2]").click();
    cy.contains("Tilbage").click();
    cy.get("[data-cy=list-facets]").contains("with, comma");

    // Sync with url, close modal
    cy.contains("resultater").click();

    cy.get("[data-cy=router-query]").then((el) => {
      expect(JSON.parse(el.text())).to.deep.equal({
        "q.all": "some query",
        subjects: "with__ comma",
      });
    });
  });

  it(`Restore filters when browser's back button is used`, () => {
    cy.visit(
      `${nextjsBaseUrl}/find?q.all=katte&workType=article&materialTypes=avisartikel`
    );

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

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiPath");

describe("Search", () => {
  beforeEach(() => {
    cy.visit(`${nextjsBaseUrl}/find?q.all=harry potter`);
    cy.consentAllowAll();
  });

  it(`Should show search results`, () => {
    cy.get('[data-cy="result-row"]', { timeout: 10000 }).should(
      "have.length",
      10
    );

    // feedback should be visible
    cy.get('[data-cy="cy-feedback-container"]').should("be.visible");

    // click grid view, should be reflected in url
    /** PJO removed gridview and listview - they do not work yet .. if ever
     cy.get('[data-cy="grid-button"]').first().click();
     cy.url().should("include", "view=grid");

     // click list view, should be reflected in url
     cy.get('[data-cy="list-button"]').first().click();
     cy.url().should("include", "view=list");
     **/

    // click page 2, should be reflected in url
    cy.get('[data-cy="page-2-button"]').click({ force: true });
    cy.url().should("include", "page=2");
    // feedback should NOT be visible
    cy.get('[data-cy="cy-feedback-container"]').should("not.exist");

    // click page 3, should be reflected in url
    cy.get('[data-cy="page-3-button"]').click({ force: true });
    cy.url().should("include", "page=3");
  });

  it(`Should link to work page`, () => {
    cy.get('[data-cy="result-row"]', { timeout: 10000 }).first().click();
    cy.url().should("include", "/materiale");
  });

  it(`Should collect data when searching and clicking work`, () => {
    // Intercept data collection requests to graphql
    cy.intercept("POST", `${fbiApiPath}`, (req) => {
      if (req.body.query.startsWith("mutation")) {
        if (req.body.variables?.input?.search) {
          req.alias = "apiMutationOnSearch";
        } else if (req.body.variables?.input?.search_work) {
          req.alias = "apiMutationOnSearchClick";
        }
      }
    });

    cy.reload();

    // When search begin query should be logged
    cy.wait("@apiMutationOnSearch").then((interception) => {
      const data = interception.request.body.variables.input.search;
      expect(data.search_request.q.all).to.equal("harry potter");
      expect(data.search_response_works).to.have.lengthOf(10);
      expect(data.search_response_works[0]).to.contain("work-of");
      expect(data.search_offset).to.equal(0);
      expect(data.session_id).to.equal("test");
      expect(interception.response.body.errors).to.be.undefined;
    });

    // wait for data to be loaded
    cy.get('[data-cy="result-row"]').should("exist").first().click();

    // clicking the row should log
    cy.wait("@apiMutationOnSearchClick").then((interception) => {
      const data = interception.request.body.variables.input.search_work;

      expect(data.search_request.q.all).to.equal("harry potter");
      expect(data.search_query_hit).to.equal(1);
      expect(data.search_query_work).to.contain("work-of:");
      expect(data.session_id).to.equal("test");
      expect(interception.response.body.errors).to.be.undefined;
    });
  });

  it(`Desktop: Fake searchfield not visible`, () => {
    cy.get('[data-cy="fake-search-input"]').should("not.be.visible");
  });

  it(`Mobile: Has searchfield including query`, () => {
    cy.viewport(411, 731);
    cy.get('[data-cy="fake-search-input"]').contains("harry potter");
  });
});

describe("Search => storybook", () => {
  it(`Should focus elements when tabbing`, () => {
    cy.visit("/iframe.html?id=search-result--default&viewMode=story");

    cy.get("[data-cy=result-row]")
      .should("exist")
      .should("have.attr", "data-cy", "result-row")
      .tabs(5)
      .should("have.attr", "data-cy", "result-row")
      .tabs(2)
      .focused()
      .should("have.attr", "data-cy", "result-row");
  });

  // grid buttons is not working, skipped until implemented
  it.skip(`Should focus grid buttons when tabbing`, () => {
    cy.visit("/iframe.html?id=search-quickfilters--default&viewMode=story");
    cy.get("body").tab();
    cy.focused().should("have.attr", "data-cy", "grid-button");

    cy.tab();
    cy.focused().should("have.attr", "data-cy", "list-button");
  });

  it(`Should focus pagination buttons when tabbing`, () => {
    cy.visit("/iframe.html?id=search-pagination--default&viewMode=story");

    cy.get("[data-cy=page-1-button]")
      .should("exist")
      .should("have.attr", "data-cy", "page-1-button")
      .tab()
      .should("have.attr", "data-cy", "page-2-button")
      .tabs(2)
      .should("have.attr", "data-cy", "page-4-button");
  });
});

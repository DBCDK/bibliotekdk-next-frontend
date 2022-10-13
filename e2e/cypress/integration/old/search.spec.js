const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const graphqlPath = Cypress.env("graphqlPath");
const fbiApiPath = Cypress.env("fbiApiPath");

describe("Search", () => {
  it(`Should show search results`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q.all=harry potter`);
    cy.get('[data-cy="result-row"]').should("have.length", 10);

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

    // click page 3, should be reflected in url
    cy.get('[data-cy="page-3-button"]').click({ force: true });
    cy.url().should("include", "page=3");
  });

  it(`Should link to work page`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q.all=harry potter`);
    cy.get('[data-cy="result-row"]').first().click();
    cy.url().should("include", "/materiale");
  });

  // OBS.... fix incomming
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

    // Allow cookies
    cy.visit(`${nextjsBaseUrl}`);
    cy.get("[data-cy=button-ok]").click();

    cy.visit(`${nextjsBaseUrl}/find?q.all=harry potter`);

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
    cy.get('[data-cy="result-row"]');

    // click on row
    cy.get('[data-cy="result-row"]').first().click();

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

  it(`Should focus elements when tabbing`, () => {
    cy.visit("/iframe.html?id=search-result--default&viewMode=story");

    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "result-row");

    cy.tabs(2);
    cy.focused().should("have.attr", "data-cy", "result-row");
  });

  // grid buttons is not working, skipped until implemented
  it.skip(`Should focus grid buttons when tabbing`, () => {
    cy.visit("/iframe.html?id=search-quickfilters--default&viewMode=story");
    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "grid-button");

    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "list-button");
  });

  it(`Should focus pagination buttons when tabbing`, () => {
    cy.visit("/iframe.html?id=search-pagination--default&viewMode=story");

    cy.tabs(2);
    cy.focused().should("have.attr", "data-cy", "page-1-button");

    cy.tabs(3);
    cy.focused().should("have.attr", "data-cy", "page-4-button");
  });

  it(`Desktop: Fake searchfield not visible`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q.all=harry potter`);
    cy.get('[data-cy="fake-search-input"]').should("not.be.visible");
  });

  it(`Mobile: Has searchfield including query`, () => {
    cy.viewport(411, 731);
    cy.visit(`${nextjsBaseUrl}/find?q.all=harry potter`);
    cy.get('[data-cy="fake-search-input"]').contains("harry potter");
  });
});

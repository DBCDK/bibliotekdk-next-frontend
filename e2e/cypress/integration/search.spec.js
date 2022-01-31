const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

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

  it(`Should collect data when searching and clicking work`, () => {
    // Intercept data collection requests to graphql
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.startsWith("mutation")) {
        if (req.body.variables?.input?.search) {
          req.alias = "apiMutationOnSearch";
        } else if (req.body.variables?.input?.search_work) {
          req.alias = "apiMutationOnSearchClick";
        }
      }
    });

    cy.visit(`${nextjsBaseUrl}/find?q.all=harry potter`);

    // When search begin query should be logged
    cy.wait("@apiMutationOnSearch").then((interception) => {
      const data = interception.request.body.variables.input.search;
      expect(data.search_request.q.all).to.equal("harry potter");
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

  it(`renders hitcount data on server`, () => {
    // we make a "request" instead of "visit" to see
    // the actual html returned from the server
    // set isBot=true to make sure data is loaded on server
    cy.request(`${nextjsBaseUrl}/find?q.all=harry potter&isBot=true`)
      .its("body")
      .then((html) => {
        const desc_regex = /<\s*meta name="description"[^>]*\/>/g;
        const value_regex = /content=\"(.*?)\"/;

        const metaDescription = html.match(desc_regex)[0];
        const value = metaDescription.match(value_regex)[1];

        // This is live data and the hitcount number may change in future.
        // We expect NOT to have a undefined string/number in the description content.
        expect(value).to.not.have.string("undefined");
        expect(value).to.not.have.string(" 0 ");
      });
  });

  it(`All buttons should be tabbable`, () => {
    cy.visit("/iframe.html?id=modal-search--default&viewMode=story");

    cy.wait(1000);
    cy.tab();
    cy.focused().contains("Luk");
    cy.tabs(6);
    cy.focused().contains("Luk");
  });

  it(`Can submit all input fields`, () => {
    cy.visit("/iframe.html?id=modal-search--default&viewMode=story");

    cy.wait(500);

    cy.get("[data-cy=search-input-title]").type("Some title");
    cy.get("[data-cy=search-input-creator]").type("Some creator");
    cy.get("[data-cy=search-input-subject]").type("Some subject");

    cy.get("[data-cy=search-button-submit]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(
        `{"pathname":"/","query":{"q.creator":"Some creator","q.subject":"Some subject","q.title":"Some title"}}`
      );
    });
  });

  it(`Can clear all input fields`, () => {
    cy.visit("/iframe.html?id=modal-search--default&viewMode=story");

    cy.wait(500);

    cy.get("[data-cy=search-input-title]").type("Some title");
    cy.get("[data-cy=search-input-creator]").type("Some creator");
    cy.get("[data-cy=search-input-subject]").type("Some subject");

    cy.get("[data-cy=clear-all-search]").click();

    cy.wait(500);

    cy.get("[data-cy=search-button-submit]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`{"pathname":"/","query":{}}`);
    });
  });

  it(`Should have a hitcount with real data`, () => {
    cy.visit(`${nextjsBaseUrl}`);

    cy.get("[data-cy=suggester-input]").type("Harry");
    cy.get("[data-cy=header-searchbutton]").click();
    cy.get("[data-cy=view-all-advanced-search]").click();

    cy.wait(500);

    cy.get("[data-cy=search-input-title]").type(
      "Harry Potter og De Vises Sten"
    );
    cy.get("[data-cy=search-input-creator]").type("Joanne K. Rowling");
    cy.get("[data-cy=search-input-subject]").type("magi").blur();

    cy.wait(500);

    cy.get("[data-cy=search-button-submit]").should("not.include.text", "0");
    cy.get("[data-cy=search-button-submit]").click();
    cy.get("[data-cy=section-title]").should("not.include.text", "0");

    cy.url().should(
      "include",
      "/find?q.all=Harry&q.creator=Joanne+K.+Rowling&q.subject=magi&q.title=Harry+Potter+og+De+Vises+Sten"
    );
  });
});

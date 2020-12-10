const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Search", () => {
  it(`Should show search results`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q=harry potter`);
    cy.get('[data-cy="result-row"]').should("have.length", 10);

    // click grid view, should be reflected in url
    cy.get('[data-cy="grid-button"]').first().click();
    cy.url().should("include", "view=grid");

    // click list view, should be reflected in url
    cy.get('[data-cy="list-button"]').first().click();
    cy.url().should("include", "view=list");

    // click page 2, should be reflected in url
    cy.get('[data-cy="page-2-button"]').click();
    cy.url().should("include", "page=2");

    // click page 3, should be reflected in url
    cy.get('[data-cy="page-3-button"]').click();
    cy.url().should("include", "page=3");
  });

  it(`Should link to work page`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q=harry potter`);
    cy.get('[data-cy="result-row"]').first().click();
    cy.url().should("include", "/materiale");
  });

  it(`Should collect data when clicking work result`, () => {
    cy.visit(`${nextjsBaseUrl}/find?q=harry potter`);
    // wait for data to be loaded
    cy.get('[data-cy="result-row"]');

    cy.intercept({
      method: "POST",
      url: "/graphql",
    }).as("apiCheck");

    cy.get('[data-cy="result-row"]').first().click();

    cy.wait("@apiCheck").then((interception) => {
      const data = interception.request.body.variables.input.search_work;
      expect(data.search_query).to.equal("harry potter");
      expect(data.search_query_hit).to.equal(1);
      expect(data.search_query_work).to.contain("work-of:");
      expect(data.session_id).to.equal("test");
      expect(interception.response.body.errors).to.be.undefined;
    });
  });

  it(`Should focus elements when tabbing`, () => {
    cy.visit("/iframe.html?id=search-result--search-result&viewMode=story");
    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "grid-button");

    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "list-button");

    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "result-row");

    cy.tabs(3);
    cy.focused().should("have.attr", "data-cy", "page-1-button");

    cy.tabs(3);
    cy.focused().should("have.attr", "data-cy", "page-4-button");
  });
});

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

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Tabs function
 * @param {int} n // n is number of tabs -> default to 1
 *
 */
Cypress.Commands.add("tabs", (n = 1) => {
  for (let i = 0; i < Number(n); i++) {
    cy.tab();
  }
});

Cypress.Commands.add("login", () => {
  cy.intercept("/api/auth/session", {
    body: {
      user: {
        uniqueId: "3ad8276b-43ed-430e-891d-3238996da656",
        agencies: [
          { agencyId: "190110", userId: "lkh@dbc.dk", userIdType: "LOCAL" },
          { agencyId: "191977", userId: "10003", userIdType: "LOCAL" },
          { agencyId: "191977", userId: "0102033696", userIdType: "CPR" },
          { agencyId: "790900", userId: "C04122017435", userIdType: "LOCAL" },
        ],
      },
      expires: "2021-06-26T07:00:09.408Z",
      accessToken: "dummy-token",
    },
  });
  cy.fixture("user.json").then((fixture) => {
    cy.intercept("POST", "/190101/bibdk21/graphql", (req) => {
      if (req.body.query.includes("user {")) {
        req.reply(fixture);
      }
    });
  });
});

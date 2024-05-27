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

const fbiApiPath = Cypress.env("fbiApiPath");
require("cypress-plugin-tab");

/**
 * Tabs function
 * @param {number} n // n is number of tabs -> default to 1
 *
 */
Cypress.Commands.add("tabs", (n = 1) => {
  for (let i = 0; i < Number(n); i++) {
    cy.tab();
  }
});

Cypress.Commands.add("visitWithConsoleSpy", (url) => {
  cy.visit(url);
  cy.window()
    .its("console")
    .then((console) => {
      cy.spy(console, "debug").as("log");
    });
});

Cypress.Commands.add("verifyMatomoEvent", (event) => {
  cy.window()
    .its("document")
    .then((document) => {
      expect(document?._paq?.[0], "Verifying matomo event").to.deep.equal(
        event
      );
      document._paq = [];
    });
});

Cypress.Commands.add("getConsoleEntry", (match) => {
  return cy
    .get("@log")
    .invoke("getCalls")
    .then((calls) => {
      const filtered = calls.filter((call) => call.args[0] === match);

      return filtered?.length > 0 ? filtered[filtered.length - 1].args : null;
    });
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
    cy.intercept("POST", `${fbiApiPath}`, (req) => {
      if (req.body.query.includes("user {")) {
        req.reply(fixture);
      }
    });
  });
});

Cypress.Commands.add("consentAllowAll", () => {
  cy.get("#CybotCookiebotDialog", { timeout: 10000 })
    .should("be.visible")
    .then(($box) => {
      if ($box.is(":visible")) {
        cy.get("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll", {
          timeout: 10000,
        }).click();
      }
    });
});

Cypress.Commands.add("cssVar", (cssVarName) => {
  return cy.document().then((doc) => {
    return window
      .getComputedStyle(doc.body)
      .getPropertyValue(cssVarName)
      .trim();
  });
});

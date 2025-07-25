/**
 * @file
 * Test functionality of the cookie box
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiPath");

describe("CookieBot", () => {
  beforeEach(function () {
    cy.visit(`${nextjsBaseUrl}`);
  });

  it(`can accept cookies`, () => {
    cy.get("#CybotCookiebotDialog")
      .should("exist")
      .should("contain.text", "Hjemmesiden bruger cookies");

    cy.getCookies().should("have.length", 1);
    cy.getCookie("next-auth.anon-session").should("exist");

    cy.get("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll").click();

    cy.wait(1000);

    // Check matomo does not disable cookies when they are allowed
    cy.getCookies().then(() => {
      cy.getCookie("CookieConsent").should("exist");
      cy.getCookie("next-auth.anon-session").should("exist");

      cy.getCookie("CookieConsent").then((cookie) => {
        expect(cookie.value).to.contain("necessary:true");
        expect(cookie.value).to.contain("preferences:true");
        expect(cookie.value).to.contain("statistics:true");
        expect(cookie.value).to.contain("marketing:true");
      });
    });

    cy.get("#CookiebotWidget").should("not.exist");
  });

  it(`can deny cookies`, () => {
    cy.get("#CybotCookiebotDialogBodyButtonDecline").click();

    cy.wait(1000);

    cy.getCookies().then(() => {
      cy.getCookie("CookieConsent").should("exist");
      cy.getCookie("next-auth.anon-session").should("exist");

      cy.getCookie("CookieConsent").then((cookie) => {
        expect(cookie.value).to.contain("necessary:true");
        expect(cookie.value).to.contain("preferences:false");
        expect(cookie.value).to.contain("statistics:false");
        expect(cookie.value).to.contain("marketing:false");
      });
    });
  });

  it(`can trigger cookie consent dialog from footer`, () => {
    cy.visit(`${nextjsBaseUrl}`);
    cy.get("#CybotCookiebotDialogBodyButtonDecline").click();
    cy.get("[data-cy=footer-column] [data-cy=link]").scrollIntoView().click();

    cy.get("#CybotCookiebotDialog")
      .should("exist")
      .should("contain.text", "Hjemmesiden bruger cookies");
  });

  it.skip(`Set correct FBI-API headers that corresponds to consent`, () => {
    cy.intercept("POST", `${fbiApiPath}`).as("fbiApiRequestNoConsent");
    cy.visit(`${nextjsBaseUrl}`);

    cy.get("#CybotCookiebotDialog")
      .should("exist")
      .should("contain.text", "Hjemmesiden bruger cookies");

    cy.getCookies().should("have.length", 1);
    cy.getCookie("next-auth.anon-session").should("exist");

    cy.wait("@fbiApiRequestNoConsent")
      .its("request.headers")
      .should((headers) => {
        expect(headers).to.have.property("x-tracking-consent", "false");
        expect(headers).to.have.property("x-session-token", "test");
        expect(headers).to.have.property("x-client-fingerprint", "fp_test");
      });

    cy.get("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll").click();
    cy.intercept("POST", `${fbiApiPath}`).as("fbiApiRequestConsent");
    cy.reload();

    cy.wait("@fbiApiRequestConsent")
      .its("request.headers")
      .should((headers) => {
        expect(headers).to.have.property("x-tracking-consent", "true");
        expect(headers).to.have.property("x-session-token", "test");
        expect(headers).to.have.property("x-client-fingerprint", "fp_test");
      });
  });
});

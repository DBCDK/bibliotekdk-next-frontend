/**
 * @file
 * Test functionality of the cookie box
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

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
});

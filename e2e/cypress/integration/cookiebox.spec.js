/**
 * @file
 * Test functionality of the cookie box
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("CookieBox", () => {
  it(`can accept cookies`, () => {
    cy.visit(`${nextjsBaseUrl}`);

    cy.get("[data-cy=cookiebox")
      .should("exist")
      .should("contain.text", "Vi går op i at anvende data ansvarligt");

    // Check matomo cookies are disabled by default
    cy.request(`${nextjsBaseUrl}`)
      .its("body")
      .then((html) => {
        expect(html).to.have.string('_paq.push(["disableCookies"])');
      });

    cy.get("[data-cy=button-ok]").click();

    cy.get("[data-cy=cookiebox").should("not.exist");

    // Check matomo does not disable cookies when they are allowed
    cy.request(`${nextjsBaseUrl}`)
      .its("body")
      .then((html) => {
        expect(html).to.not.have.string('_paq.push(["disableCookies"])');
      });
  });

  it(`can deny cookies`, () => {
    cy.visit(`${nextjsBaseUrl}`);

    cy.get("[data-cy=button-nej-tak]").click();

    cy.get("[data-cy=cookiebox").should("not.exist");

    // Check matomo cookies are disabled
    cy.request(`${nextjsBaseUrl}`)
      .its("body")
      .then((html) => {
        expect(html).to.have.string('_paq.push(["disableCookies"])');
      });
  });

  it(`can show cookie policy article`, () => {
    cy.visit(`${nextjsBaseUrl}`);

    cy.get("[data-cy=text-privatlivspolitik]").first().click();

    cy.contains("En cookie er en lille tekstfil, som lægges på din computer");

    // Check that we show the small cookiebox variant on article page
    // where the description is hidden
    cy.get(
      '[data-cy="text-vi-går-op-i-at-anvende-data-ansvarligt,-og-bruger-kun-cookies-til-at-forbedre-din-brugeroplevelse."]'
    ).should("not.be.visible");
  });
});

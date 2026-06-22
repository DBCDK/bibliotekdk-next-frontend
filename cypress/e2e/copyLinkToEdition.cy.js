/**
 * @file
 * E2E test for "Kopier link til udgave" permalink flow on a real work.
 *
 * Test data is shared with linkme.cy.js:
 * manifestation 874310-katalog:DBB0422141 on "Grum : Roman fra Sø og Mose".
 */
const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

const manifestationPid = "874310-katalog:DBB0422141";
const permalinkPath = `/work/pid/${manifestationPid}?scrollToEdition=true`;

describe("copy link to edition", () => {
  it("redirects permalink to work page with edition hash and without 404", () => {
    cy.visit(`${nextjsBaseUrl}${permalinkPath}`);

    cy.contains("Siden blev ikke fundet").should("not.exist");

    cy.url({ timeout: 20000 })
      .should("include", "/materiale/")
      .and("include", "work-of:")
      .and("include", `#${manifestationPid}`);
  });
});

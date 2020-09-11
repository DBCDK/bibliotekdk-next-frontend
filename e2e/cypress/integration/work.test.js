/**
 * @file
 * Test functionality of work landing page
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Work", () => {
  it(`Shows work data`, () => {
    cy.visit("/?path=/story/prototype-work--doppler");
    cy.contains("Doppler");
  });

  it(`renders all data on server`, () => {
    // we make a "request" instead of "visit" to see
    // the actual html returned from the server
    // set timeout to 10000ms to make sure data is loaded on server
    cy.request(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/870970-basis:53033423?timeout=10000`
    )
      .its("body")
      .then((html) => {
        expect(html).to.have.string("<h1>1950 High Noon</h1");
      });
  });

  it(`renders no data on server`, () => {
    // we make a request instead of visit to see
    // the actual html returned from the server
    // set timeout to 1ms to make sure no data is loaded on server
    cy.request(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/870970-basis:53033423?timeout=1`
    )
      .its("body")
      .then((html) => {
        expect(html).to.not.have.string("<h1>1950 High Noon</h1");
        expect(html).to.have.string("<h1>Indlæser</h1");
      });
  });
});

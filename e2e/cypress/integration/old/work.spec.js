/**
 * @file
 * Test functionality of work landing page
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const graphqlPath = Cypress.env("graphqlPath");

describe("Work", () => {
  it(`renders all data on server`, () => {
    // we make a "request" instead of "visit" to see
    // the actual html returned from the server
    // set isBot=true to make sure data is loaded on server
    cy.request(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/work-of:870970-basis:53033423?isBot=true`
    )
      .its("body")
      .then((html) => {
        expect(html).to.have.string("1950 High Noon</h1");
      });
  });

  it(`renders no data on server`, () => {
    // we make a request instead of visit to see
    // the actual html returned from the server
    cy.request(
      `${nextjsBaseUrl}/materiale/1950-high-noon_gunnar/work-of:870970-basis:53033423`
    )
      .its("body")
      .then((html) => {
        expect(html).to.not.have.string("1950 High Noon</h1");
      });
  });
});

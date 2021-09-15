/**
 * @file
 * Test functionality of the useData hook.
 * See the api.stories.js file to make sense of these tests
 */
describe.skip("Testing useData hook", () => {
  it(`is able to fetch data, showing the different load states`, () => {
    cy.visit("/iframe.html?id=hooks-usedata--fetching-data&viewMode=story");
    cy.contains("loader");
    cy.contains("langsomt");
    cy.contains("Doppler");
  });

  it(`shows error`, () => {
    cy.visit(
      "/iframe.html?id=hooks-usedata--error-fetching-data&viewMode=story"
    );
    cy.contains("error");
  });
});

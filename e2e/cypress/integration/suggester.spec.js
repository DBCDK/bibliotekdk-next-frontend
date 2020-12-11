/**
 * @file
 * Test functionality of Header
 */
describe("Header", () => {
  before(function () {
    cy.visit("/iframe.html?id=header--nav-header");
  });

  // Tabs
  it.only(`Can tab through all clickable elements`, () => {});
});

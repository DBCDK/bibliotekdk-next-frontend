/**
 * @file
 * Test feedback
 */
describe("feedbacklink", () => {
  it(`View in BIG viewport`, () => {
    cy.visit("/iframe.html?id=base-feedbacklink--feedback");
    // verify that banner is shown
    cy.get("[data-cy=feedbacklink-to-kundeservice]").should("be.visible");
    cy.get("[data-cy=feedbacklink-to-kundeservice]").should(
      "have.attr",
      "href",
      "https://kundeservice.dbc.dk/bibdk"
    );
  });
});

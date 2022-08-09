/**
 * @file
 * Test feedback for search results
 */
describe("searchfeedback", () => {
  it(`thumbsup click`, () => {
    cy.visit("/iframe.html?id=base-searchfeedback--feed-back");
    // verify that banner is shown
    cy.get("[data-cy=search-feedback-thumbsup]").should("be.visible");
    cy.get("[data-cy=search_feed_back_thankyou]").should("not.exist");
    cy.get("[data-cy=search-feedback-thumbsup]").click();

    cy.get("[data-cy=search_feed_back_thankyou]").should("be.visible");
  });

  it(`thumbsdown click`, () => {
    cy.visit("/iframe.html?id=base-searchfeedback--feed-back");
    // verify that banner is shown
    cy.get("[data-cy=search-feedback-thumbsdown]").should("be.visible");

    cy.get("[data-cy=search-feedback-form]").should("not.exist");

    cy.get("[data-cy=search-feedback-thumbsdown]").click();

    cy.get("[data-cy=search-feedback-form]").should("be.visible");

    cy.get("[data-cy=search-feedback-input]").type("fisk");

    cy.get("[data-cy=search-feedback-form] Button").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("fisk");
    });
  });
});

describe("Overview", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-reviews--reviews-slider");
  });

  it(`First 2 reviews should be visible`, () => {
    cy.get("[data-cy=review-material").first().should("be.visible");
    cy.get("[data-cy=review-infomedia").first().should("be.visible");
    cy.get("[data-cy=review-infomedia").last().should("not.be.visible");
  });

  it.skip(`Can tab through path`, () => {
    cy.get("body").tab();
    cy.focused().parent().should("have.attr", "data-cy", "material-review");
    cy.tabs(3);
    cy.focused().parent().should("have.attr", "data-cy", "crumb-roman");
  });
});

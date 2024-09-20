/**
 * @file
 * Test feedback
 */
describe("feedback", () => {
  before(function () {
    cy.visit("/iframe.html?id=base-tooltips--simple-tooltip-default-content");
  });

  it(`Tooltip present on click`, () => {
    cy.get('[data-cy="popover-container"]').should("not.exist");
    cy.get('[data-cy="tooltip-icon"]').click();
    cy.get('[data-cy="popover-container"]').should("be.visible");
  });
});

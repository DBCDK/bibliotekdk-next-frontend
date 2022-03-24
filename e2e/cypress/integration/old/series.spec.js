describe("Series", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-series--series-slider&viewMode=story");
  });

  it(`Should have some elements`, () => {
    cy.get("a").should("have.length", 7);
  });
});

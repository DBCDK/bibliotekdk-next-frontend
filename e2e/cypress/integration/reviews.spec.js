describe("Overview", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-reviews--reviews-slider");
  });

  it(`First 2 reviews should be visible - last not visible`, () => {
    // All reviews visible?
    cy.get(
      "[data-cy=reviews-section] [data-cy=section-content] .swiper-wrapper"
    )
      .children()
      .should("have.length", 5);

    // All materials sorted correct and is visible?
    cy.get("[data-cy=review-material]").first().should("be.visible");
    cy.get("[data-cy=review-infomedia]").first().should("be.visible");
    cy.get("[data-cy=review-infomedia]").last().should("not.be.visible");
  });

  it(`Can tab through path`, () => {
    cy.get("body").tabs(3);
    cy.focused()
      .parent()
      .parent()
      .should("have.attr", "data-cy", "review-material");
    cy.tabs(4);
    cy.focused().should("have.attr", "data-cy", "litteratursiden-link");
  });

  // Slider is now infinite -> buttons will never get disabled
  it.skip(`Can navigate with arrows`, () => {
    // reset slider
    cy.visit("/iframe.html?id=work-reviews--reviews-slider");

    // Check navigation-button status
    cy.get("[data-cy=arrow-left]")
      .should("have.css", "background-color")
      .and("eq", "rgb(214, 214, 215)");

    cy.get("[data-cy=arrow-right]")
      .should("have.css", "background-color")
      .and("eq", "rgb(51, 51, 255)");

    // Navigate to end of slider
    cy.get("[data-cy=arrow-right]").click().click().click();

    // Check that navigation-button status have changed
    cy.get("[data-cy=arrow-right]")
      .should("have.css", "background-color")
      .and("eq", "rgb(214, 214, 215)");

    cy.get("[data-cy=arrow-left]")
      .should("have.css", "background-color")
      .and("eq", "rgb(51, 51, 255)");
  });
});

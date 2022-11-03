describe("Overview", () => {
  before(function () {
    cy.visit(
      "/iframe.html?id=work-reviews--wrapped-reviews-slider&viewMode=story"
    );
  });

  it(`First review should be visible - last not visible`, () => {
    cy.contains("Anmeldelser (4)");

    cy.get(".swiper-slide").should("have.length", 4);
    cy.get(" .swiper-slide").last().should("not.be.visible");
    cy.get(" .swiper-slide").first().should("be.visible");
  });

  it(`should link to mentioned work for librarians review`, () => {
    cy.contains("Some other great book").should(
      "have.attr",
      "href",
      "/materiale/some-other-great-book_some-creator/some-other-work-id"
    );
  });

  it(`infomedia review should link to infomedia page`, () => {
    cy.get("[data-cy=review-infomedia]")
      .contains("Læs anmeldelse")
      .should(
        "have.attr",
        "href",
        "/infomedia/anmeldelse_great-book/work.workId?review=some-pid-3"
      );
  });

  it(`external review should link to external site`, () => {
    cy.get("[data-cy=review-external]")
      .contains("Læs anmeldelse")
      .should("have.attr", "href", "http://some-external-site/some-path");
  });

  it(`reviews are ordered correctly`, () => {
    // Librarians reviews should come first
    cy.get(".swiper-slide").eq(0).contains("Lektørudtalelse");

    // Then litteratursiden, because it has external url (accessible without login)
    cy.get(".swiper-slide").eq(1).contains("Litteratursiden");

    // Then Politiken, because it has a rating
    cy.get(".swiper-slide").eq(2).contains("Politiken");

    // Finally Some Periodica, because it is not available anywhere
    cy.get(".swiper-slide").eq(3).contains("Some Periodica");
  });

  //BETA-1 skip this test - material reviews are gone
  it.skip(`Can tab through path`, () => {
    cy.get("body").tabs(3);
    cy.focused()
      .parent()
      .parent()
      .should("have.attr", "data-cy", "review-infomedia");
    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "link");
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

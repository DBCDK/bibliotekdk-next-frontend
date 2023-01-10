describe("Overview", () => {
  describe("Page", () => {
    before(function () {
      cy.visit(
        "/iframe.html?id=articles-page--wrapped-infomedia-review-page&viewMode=story"
      );
    });
    it.skip(`Displays the contents of a review from infomedia`, () => {
      cy.contains("infomedia.article.headLine");
      cy.contains(
        "infomedia.article.paper (work.workReviews[0].periodica.pages)"
      );
      cy.contains("Læsetid: 1 min.");
      cy.contains(
        "work.subjects.dbcVerified[0].display, work.subjects.dbcVerified[1].display"
      );
      cy.contains("5 nov. 2022");
      cy.contains("work.workReviews[0].author");
      cy.contains("infomedia.article.subHeadLine");
      cy.contains("infomedia.article.hedLine");
      cy.contains("infomedia.article.text");
      cy.contains("Infomedia disclaimer");
    });
  });
  describe("Review Slider", () => {
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
      cy.contains("Some book title").should(
        "have.attr",
        "href",
        "/materiale/some-book-title_some-creator/some-work-id"
      );
    });

    it(`infomedia review should link to infomedia page`, () => {
      cy.get("[data-cy=review-infomedia]")
        .contains("Læs anmeldelse")
        .should(
          "have.attr",
          "href",
          "/anmeldelse/great-book/some-work-id/some-infomedia-id"
        );
    });

    it(`external review should link to external site`, () => {
      cy.get("[data-cy=review-external]")
        .contains("Læs anmeldelse")
        .should("have.attr", "href", "http://www.some-url.dk");
    });

    it(`reviews are ordered correctly`, () => {
      // Librarians reviews should come first
      cy.get(".swiper-slide").eq(0).contains("Lektørudtalelse");

      // Then litteratursiden, because it has external url (accessible without login)
      cy.get(".swiper-slide").eq(1).contains("External publication (url)");

      // Then Politiken, because it has a rating
      cy.get(".swiper-slide").eq(2).contains("Infomedia publication");

      // Finally Some Periodica, because it is not available anywhere
      cy.get(".swiper-slide").eq(3).contains("External publication (no url)");
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
});

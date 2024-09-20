describe("Overview", () => {
  describe("Page", () => {
    it(`Displays the contents of a review from infomedia`, () => {
      cy.visit(
        "/iframe.html?id=articles-page--wrapped-infomedia-review-page&viewMode=story"
      );
      cy.contains("Some review headline");
      cy.contains("Some paper (Some page number)");
      cy.contains("Læsetid: 1 min.");
      cy.contains("Some topic, Some other topic");
      cy.contains("24. December 2000");
      cy.contains("Some creator");
      cy.contains("Some review subHeadLine");
      cy.contains("Some hedline");
      cy.contains("Some text given as html ...");
      cy.contains("Infomedia disclaimer");
    });
    it(`Displays the contents of a lector review`, () => {
      cy.visit(
        "/iframe.html?id=articles-page--wrapped-lector-review-page&viewMode=story"
      );
      cy.contains("Bibliotekernes");
      cy.contains("vurdering");

      cy.contains("Hugo i Sølvskoven 5: Gulvguldmonstrene mod Grullerne");

      // "Hugo i Sølvskoven 4":
      //  in DESCRIPTION === 1
      //  + SIMILAR_MATERIALS === 1
      //  + once in "lignende materialer" === 1
      //  ===> 3
      cy.get(
        "a:contains('Hugo i Sølvskoven 4: Guldet glimter, sølvet smelter, gulvet vælter')"
      ).should("have.length", 3);

      // "Hugo i Sølvskoven 2":
      //  in SIMILAR_MATERIALS === 1
      //  + once in "lignende materialer" === 1
      //  ===> 2
      cy.get("a:contains('Hugo i Sølvskoven 2: Rise of Rita')").should(
        "have.length",
        2
      );
    });
  });
  describe("Review Slider", () => {
    beforeEach(function () {
      cy.visit(
        "/iframe.html?id=work-reviews--wrapped-reviews-slider&viewMode=story"
      );
    });

    it(`First review should be visible - last not visible`, () => {
      cy.contains("Anmeldelser (");
      cy.contains("Bibliotekernes vurdering");
      cy.should("not.have.text", "External");
    });

    it(`should link to mentioned work for librarians review`, () => {
      cy.contains("Some book title").should(
        "have.attr",
        "href",
        "/materiale/some-book-title_some-creator/some-work-id"
      );
    });

    it(`infomedia review should link to infomedia page`, () => {
      cy.get("[data-cy=review-item-isInfomediaReview]")
        .contains("Læs anmeldelse")
        .should(
          "have.attr",
          "href",
          "/anmeldelse/great-book/some-work-id/some-infomedia-id"
        );
    });

    it(`external review should link to external site`, () => {
      cy.get("[data-cy=review-item-isExternalReview]")
        .contains("Læs anmeldelse")
        .should("have.attr", "href", "http://www.some-url.dk");
    });

    it(`reviews are ordered correctly`, () => {
      // Librarians reviews should come first
      cy.contains("Bibliotekernes vurdering");

      // Then litteratursiden, because it has external url (accessible without login)
      cy.get("[data-cy=right_arrow]").click();
      cy.contains("Bibliotekernes vurdering");

      cy.wait(200);
      cy.get("[data-cy=right_arrow]").click({ force: true });
      cy.contains("External");
      cy.contains("(url)");

      cy.wait(200);
      cy.get("[data-cy=right_arrow]").click({ force: true });
      cy.contains("External");
      cy.contains("Infomedia");

      cy.wait(200);
      cy.get("[data-cy=right_arrow]").click({ force: true });
      cy.contains("Infomedia");
      cy.contains("External");
      cy.contains("(no url)");
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

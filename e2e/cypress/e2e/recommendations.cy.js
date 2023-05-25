describe("Series", () => {
  beforeEach(function () {
    cy.visitWithConsoleSpy(
      "/iframe.html?id=work-recommendations--wrapped-recommendations-slider&viewMode=story"
    );
    cy.viewport(1920, 1080);
  });

  it(`Verify title and creator are shown`, () => {
    cy.contains("Minder om");
    cy.get("a").should("have.length", 20);

    cy.get("a").eq(0).contains("recommend.result[0].work.titles.full[0]");
    cy.get("a").eq(0).contains("recommend.result[0].work.creators[0].display");

    cy.get("a").eq(1).contains("recommend.result[1].work.titles.full[0]");
    cy.get("a").eq(1).contains("recommend.result[1].work.creators[0].display");

    cy.get("a")
      .eq(0)
      .should("have.attr", "href")
      .and(
        "contain",
        "/materiale/recommend-result-0-work-titles-full-0-recommend-result-0-work-titles-full-1-_recommend-result-0-work-creators-0-display/recommend.result[0].work.workId"
      );
  });

  it(`Should collect data for recommender`, () => {
    // Click first element
    cy.contains("recommend.result[0].work.titles.full[0]").click();

    cy.getConsoleEntry("data_collect").then((entry) => {
      const actual = entry[1]?.recommender_click;
      expect(actual.session_id).to.exist;

      delete actual.session_id;

      expect(entry[1]).to.deep.equal({
        recommender_click: {
          recommender_based_on: "work-of:870970-basis:07276346",
          recommender_click_hit: 1,
          recommender_click_work: "recommend.result[0].work.workId",
          recommender_click_reader: "recommend.result[0].reader[0]",
          recommender_shown_recommendations: [
            "recommend.result[0].work.workId",
            "recommend.result[1].work.workId",
            "recommend.result[2].work.workId",
            "recommend.result[3].work.workId",
            // "recommend.result[4].work.workId",
            // "recommend.result[5].work.workId",
          ],
        },
      });
    });
  });
  it(`Should collect all shown recommendations, when slider is scrolled`, () => {
    // Wait for recommendations to be loaded
    cy.contains("recommend.result[0].work.titles.full[0]");

    cy.contains("recommend.result[0].work.titles.full[0]").should("be.visible");
    cy.contains("recommend.result[1].work.titles.full[0]").should("be.visible");
    cy.contains("recommend.result[2].work.titles.full[0]").should("be.visible");
    cy.contains("recommend.result[3].work.titles.full[0]").should("be.visible");

    // The rest are not visible
    cy.contains("recommend.result[11].work.titles.full[0]").should(
      "not.be.visible"
    );

    // Scroll to let user see more recommendations
    cy.get("[data-cy=right_arrow]").should("be.visible").click();
    cy.contains("recommend.result[4].work.titles.full[0]").should("be.visible");
    cy.contains("recommend.result[5].work.titles.full[0]").should("be.visible");
    cy.contains("recommend.result[6].work.titles.full[0]").should("be.visible");
    cy.contains("recommend.result[7].work.titles.full[0]").should("be.visible");
    cy.contains("recommend.result[8].work.titles.full[0]").should("be.visible");

    // The first ones are not visible
    cy.contains("recommend.result[0].work.titles.full[0]").should(
      "not.be.visible"
    );

    cy.get("[data-cy=right_arrow]").should("be.visible").click();
    cy.contains("recommend.result[9].work.titles.full[0]").should("be.visible");
    cy.contains("recommend.result[10].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[11].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[12].work.titles.full[0]").should(
      "be.visible"
    );

    // The second ones are not visible
    cy.contains("recommend.result[6].work.titles.full[0]").should(
      "not.be.visible"
    );

    cy.get("[data-cy=right_arrow]").should("be.visible").click();
    cy.contains("recommend.result[13].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[14].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[15].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[16].work.titles.full[0]").should(
      "be.visible"
    );

    // 12th should not be not visible
    cy.contains("recommend.result[10].work.titles.full[0]").should(
      "not.be.visible"
    );

    cy.get("[data-cy=right_arrow]").should("be.visible").click();
    cy.contains("recommend.result[15].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[16].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[17].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[18].work.titles.full[0]").should(
      "be.visible"
    );
    cy.contains("recommend.result[19].work.titles.full[0]").should(
      "be.visible"
    );

    // The first ones and after 1st click are not visible
    cy.contains("recommend.result[0].work.titles.full[0]", {
      timeout: 10000,
    }).should("not.be.visible");
    cy.contains("recommend.result[6].work.titles.full[0]", {
      timeout: 10000,
    }).should("not.be.visible");
    cy.contains("recommend.result[10].work.titles.full[0]", {
      timeout: 10000,
    }).should("not.be.visible");
    cy.contains("recommend.result[14].work.titles.full[0]", {
      timeout: 10000,
    }).should("not.be.visible");

    cy.contains("recommend.result[19].work.titles.full[0]")
      .focus()
      .should("be.visible", { timeout: 10000 })
      .click();

    cy.getConsoleEntry("data_collect").then((entry) => {
      const actual = entry[1]?.recommender_click;
      delete actual.session_id;

      const actualRecommenderClick = entry[1].recommender_click;
      const actualRecommendations =
        actualRecommenderClick.recommender_shown_recommendations;
      const expected = {
        recommender_click: {
          recommender_based_on: "work-of:870970-basis:07276346",
          recommender_click_hit: 20,
          recommender_click_work: "recommend.result[19].work.workId",
          recommender_click_reader: "recommend.result[19].reader[0]",
          recommender_shown_recommendations: [
            "recommend.result[0].work.workId",
            "recommend.result[1].work.workId",
            "recommend.result[2].work.workId",
            "recommend.result[3].work.workId",
            "recommend.result[4].work.workId",
            "recommend.result[5].work.workId",
            "recommend.result[6].work.workId",
            "recommend.result[7].work.workId",
            "recommend.result[8].work.workId",
            "recommend.result[9].work.workId",
            "recommend.result[10].work.workId",
            "recommend.result[11].work.workId",
            "recommend.result[12].work.workId",
            "recommend.result[13].work.workId",
            "recommend.result[14].work.workId",
            "recommend.result[15].work.workId",
            "recommend.result[16].work.workId",
            "recommend.result[17].work.workId",
            "recommend.result[18].work.workId",
            "recommend.result[19].work.workId",
          ],
        },
      };
      const expectedRecommendations = expected.recommender_click;

      expect(expectedRecommendations.recommender_based_on).to.equal(
        actualRecommenderClick.recommender_based_on
      );
      expect(expectedRecommendations.recommender_click_hit).to.equal(
        actualRecommenderClick.recommender_click_hit
      );
      expect(expectedRecommendations.recommender_click_work).to.equal(
        actualRecommenderClick.recommender_click_work
      );
      expect(expectedRecommendations.recommender_click_reader).to.equal(
        actualRecommenderClick.recommender_click_reader
      );
      expectedRecommendations.recommender_shown_recommendations.forEach(
        (workId) => {
          expect(actualRecommendations).to.include(workId);
        }
      );
    });
  });
});

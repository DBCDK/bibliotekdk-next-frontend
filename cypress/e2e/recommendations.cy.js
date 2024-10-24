describe("Series", () => {
  beforeEach(function () {
    cy.visitWithConsoleSpy(
      "/iframe.html?id=work-recommendations--wrapped-recommendations-slider&viewMode=story"
    );
    cy.viewport(1920, 1080);
  });

  it(`Verify title and creator are shown`, () => {
    cy.contains("Minder om");
    cy.get("a").should("have.length", 20, { timeout: 10000 });

    cy.get("a")
      .eq(0)
      .contains("recommend.result[0].work.titles.tvSeries.title");
    cy.get("a").eq(0).contains("recommend.result[0].work.creators[");

    cy.get("a")
      .eq(1)
      .contains("recommend.result[1].work.titles.tvSeries.title");
    cy.get("a").eq(1).contains("recommend.result[1].work.creators[");

    cy.get("a")
      .eq(0)
      .should("have.attr", "href")
      // We are unaware of which creator this will use, so we just check that the rest of the href is correct
      .and(
        "contain",
        "/materiale/recommend-result-0-work-titles-tvseries-title-recommend-result-0-work-titles-tvseries-season-display-_recommend-result-0-work-creators-1-display/recommend.result[0].work.workId"
      )
      .and("contain", "-display/recommend.result[0].work.workId");
  });

  it(`Should collect data for recommender`, () => {
    // Click first element
    cy.contains("recommend.result[0].work.titles.tvSeries.title").click();

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
          ],
        },
      });
    });
  });

  it(`Should collect all shown recommendations, when slider is scrolled`, () => {
    // Wait for recommendations to be loaded
    // We test the scrolling functionaility in scrollsnapslider.cy.js, så here we emulate it
    const title = "recommend.result[19].work.titles.tvSeries.title";
    cy.contains(title);

    // Emulate the scroll using cy.scrollTo
    // The id :r0: is deterministic as we are using reacts useId
    cy.get(`#${CSS.escape(":r0:")}`).scrollTo("right", { duration: 200 });

    cy.contains(title, { timeout: 10000 })
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

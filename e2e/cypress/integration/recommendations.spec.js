describe("Series", () => {
  beforeEach(function () {
    cy.visitWithConsoleSpy(
      "/iframe.html?id=work-recommendations--wrapped-recommendations-slider&viewMode=story"
    );
  });

  it(`Verify title and creator are shown`, () => {
    cy.contains("Minder om");
    cy.get("a").should("have.length", 20);

    cy.get("a").eq(0).contains("recommend.result[0].work.titles.main[0]");
    cy.get("a").eq(0).contains("recommend.result[0].work.creators[0].display");

    cy.get("a").eq(1).contains("recommend.result[1].work.titles.main[0]");
    cy.get("a").eq(1).contains("recommend.result[1].work.creators[0].display");

    cy.get("a")
      .eq(0)
      .should(
        "have.attr",
        "href",
        "/materiale/recommend-result-0-work-titles-main-0-_recommend-result-0-work-creators-0-display/recommend.result%5B0%5D.work.workId?type=recommend.result%5B0%5D.work.manifestations.all%5B0%5D.materialTypes%5B0%5D.specific"
      );
  });

  it(`Should collect data for recommender`, () => {
    // Click first element
    cy.contains("recommend.result[0].work.titles.main[0]").click();

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
            "recommend.result[4].work.workId",
          ],
        },
      });
    });
  });
  it(`Should collect all shown recommendations, when slider is scrolled`, () => {
    // Wait for recommendations to be loaded
    cy.contains("recommend.result[0].work.titles.main[0]");

    // Scroll to let user see more recommendations
    cy.get("[data-cy=recommender] [data-cy=arrow-right]").click();
    cy.get("[data-cy=recommender] [data-cy=arrow-right]").click();

    cy.contains("recommend.result[11].work.titles.main[0]").click();

    cy.getConsoleEntry("data_collect").then((entry) => {
      const actual = entry[1]?.recommender_click;
      delete actual.session_id;

      expect(entry[1]).to.deep.equal({
        recommender_click: {
          recommender_based_on: "work-of:870970-basis:07276346",
          recommender_click_hit: 12,
          recommender_click_work: "recommend.result[11].work.workId",
          recommender_click_reader: "recommend.result[11].reader[0]",
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
          ],
        },
      });
    });
  });
});

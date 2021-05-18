const { before } = require("lodash");

/**
 * @file
 * Test functionality of recommender
 */
const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Recommender data collect", () => {
  beforeEach(() => {
    // Intercept requests to graphql
    cy.fixture("recommendations.json").then((recommendationsFixture) => {
      cy.intercept("POST", "/graphql", (req) => {
        if (req.body.query.startsWith("mutation")) {
          req.alias = "apiMutation";
        } else if (req.body.query.includes("recommendations")) {
          // mock the recommender response
          req.reply(recommendationsFixture);
        }
      });
    });

    cy.visit(
      `${nextjsBaseUrl}/materiale/korsfarers-kors-:-roman_james-lee-burke/work-of:870970-basis:26578191`
    );
  });
  it(`Should collect data for recommender`, () => {
    // When a recommendation is clicked data should be logged
    cy.get("[data-cy=text-en-regnbue-af-glas]").click();
    cy.wait("@apiMutation").then((interception) => {
      const data = interception.request.body.variables.input.recommender_click;

      expect(data).to.deep.equal({
        recommender_based_on: "work-of:870970-basis:26578191",
        recommender_click_hit: 1,
        recommender_click_work: "work-of:870970-basis:29135592",
        recommender_click_reader: "recompass-work-metacompass",
        recommender_shown_recommendations: [
          "work-of:870970-basis:29135592",
          "work-of:870970-basis:24882225",
          "work-of:870970-basis:27668097",
          "work-of:870970-basis:21182036",
          "work-of:870970-basis:25625463",
        ],
        session_id: "test",
      });

      expect(interception.response.body.errors).to.be.undefined;
    });
  });

  it(`Should collect all shown recommendations`, () => {
    // Scroll to let user see all recommendations
    // and pick the last one
    cy.get("[data-cy=recommender] [data-cy=arrow-right]").click();
    cy.get("[data-cy=recommender] [data-cy=arrow-right]").click();
    cy.get("[data-cy=text-malstrøm]").click();

    cy.wait("@apiMutation").then((interception) => {
      const data = interception.request.body.variables.input.recommender_click;

      expect(data).to.deep.equal({
        recommender_based_on: "work-of:870970-basis:26578191",
        recommender_click_hit: 10,
        recommender_click_work: "work-of:870970-basis:26780349",
        recommender_click_reader: "recompass-work-metacompass",
        recommender_shown_recommendations: [
          "work-of:870970-basis:29135592",
          "work-of:870970-basis:24882225",
          "work-of:870970-basis:27668097",
          "work-of:870970-basis:21182036",
          "work-of:870970-basis:25625463",
          "work-of:870970-basis:28269978",
          "work-of:870970-basis:25399110",
          "work-of:870970-basis:21690910",
          "work-of:870970-basis:27507271",
          "work-of:870970-basis:26780349",
        ],
        session_id: "test",
      });

      expect(interception.response.body.errors).to.be.undefined;
    });
  });
});

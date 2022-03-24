const before = require("lodash/before");

/**
 * @file
 * Test functionality of recommender
 */
const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Recommender data collect", () => {
  beforeEach(() => {
    // Allow cookies
    cy.visit(`${nextjsBaseUrl}`);
    cy.get("[data-cy=button-ok]").click();

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
    cy.wait(500);
    cy.get(
      "[data-cy=section-recommend] [data-cy=text-sidste-sporvogn-til-elysian-fields]"
    ).click();
    cy.wait("@apiMutation").then((interception) => {
      const data = interception.request.body.variables.input.recommender_click;

      expect(data).to.deep.equal({
        recommender_based_on: "work-of:870970-basis:26578191",
        recommender_click_hit: 1,
        recommender_click_work: "work-of:870970-basis:25803671",
        recommender_click_reader: "_booklens_webtrekk",
        recommender_shown_recommendations: [
          "work-of:870970-basis:25803671",
          "work-of:870970-basis:27722717",
          "work-of:870970-basis:28947240",
          "work-of:870970-basis:46014863",
          "work-of:870970-basis:27866263",
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
    cy.get("[data-cy=text-adèle-bedeau-forsvinder]").click();

    cy.wait("@apiMutation").then((interception) => {
      const data = interception.request.body.variables.input.recommender_click;

      expect(data).to.deep.equal({
        recommender_based_on: "work-of:870970-basis:26578191",
        recommender_click_hit: 10,
        recommender_click_work: "work-of:870970-basis:55103143",
        recommender_click_reader: "_booklens_webtrekk",
        recommender_shown_recommendations: [
          "work-of:870970-basis:25803671",
          "work-of:870970-basis:27722717",
          "work-of:870970-basis:28947240",
          "work-of:870970-basis:46014863",
          "work-of:870970-basis:27866263",
          "work-of:870970-basis:46068955",
          "work-of:870970-basis:51761510",
          "work-of:870970-basis:45961850",
          "work-of:870970-basis:54881789",
          "work-of:870970-basis:55103143",
        ],
        session_id: "test",
      });

      expect(interception.response.body.errors).to.be.undefined;
    });
  });
});

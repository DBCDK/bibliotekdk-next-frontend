/**
 * @file
 * Test functionality of Header
 */
const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiSimpleSearchPath");

describe("Suggester", () => {
  beforeEach(function () {
    cy.visit("/iframe.html?id=search-suggester--header-suggester");
  });

  // Tabs
  it(`Show container + container suggestions on user type`, () => {
    // container get visible when user types.
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    // 3 obj. in the data array
    cy.get("[data-cy=suggester-container] ul li").should("have.length", 3);

    // All 3 types of list items should be visible
    cy.get("[data-cy=suggester-work-element]").should("be.visible");
    cy.get("[data-cy=suggester-creator-element]").should("be.visible");
    cy.get("[data-cy=suggester-subject-element]").should("be.visible");
  });

  it(`Can use arrows to navigate thrue suggestions`, () => {
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    // Arrow navigation
    cy.get("[data-cy=suggester-input]")
      .type("{downarrow}")
      .type("{downarrow}")
      .type("{downarrow}");

    cy.get("[data-cy=suggester-creator-element]")
      .parent()
      .should("have.attr", "aria-selected", "true");
  });

  it(`Can select suggestion on 'Enter' click`, () => {
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    // Arrow navigation
    cy.get("[data-cy=suggester-input]").type("{downarrow}").type("{enter}");

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Ternet Ninja selected`);
    });
  });

  it(`Can select suggestion on 'tab' click`, () => {
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-input]")
      .type("{downarrow}")
      .type("{downarrow}")
      .tab();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`ninjaer selected`);
    });
  });

  it(`Desktop: Can select suggestion on 'mouse' click`, () => {
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-creator-element]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Anders Matthesen selected`);
    });
  });

  it(`Mobile: Can select suggestion on 'mouse' click`, () => {
    cy.viewport(411, 731);

    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-creator-element]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Anders Matthesen selected`);
    });
  });

  it(`Mobile: Should have search history on mobile version of suggester`, () => {
    cy.viewport(411, 731);
    cy.get("[data-cy=button-mobile]").click();
    cy.get("[data-cy=suggester-input]").clear();

    // Check for 2 history elements
    cy.get("[data-cy=suggester-container] ul li").should("have.length", 2);
  });

  it(`Mobile: Clear history on mobile version of suggester`, () => {
    cy.viewport(411, 731);
    cy.get("[data-cy=button-mobile]").click();

    cy.get("[data-cy=suggester-clear-history]").should("be.visible");
    cy.get("[data-cy=suggester-clear-history]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`History cleared`);
    });
  });
});

describe("Suggester data collect", () => {
  it.skip(`Should collect data for suggester`, () => {
    // Allow cookies
    cy.visit(`${nextjsBaseUrl}`);
    cy.consentAllowAll();

    // Intercept requests to graphql
    cy.intercept("POST", `${fbiApiPath}`, (req) => {
      if (req.body.query.startsWith("mutation")) {
        req.alias = "apiMutation";
      } else if (req.body.query.includes("suggest")) {
        // mock the suggest response
        req.reply({
          data: {
            suggest: {
              result: [
                {
                  id: "some-work-id",
                  type: "title",
                  term: "Hest i flugt",
                  cover: {
                    thumbnail:
                      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=51971485&attachment_type=forside_lille&bibliotek=870970&source_id=870970&key=244ae7aa540f41939461",
                  },
                },
              ],
            },
            monitor: "OK",
          },
        });
      }
    });

    cy.visit(`${nextjsBaseUrl}`);
    cy.get("[data-cy=suggester-input]").type("h");

    // When suggestions appear data should be logged
    cy.wait("@apiMutation").then((interception) => {
      const data = interception.request.body.variables.input.suggest_presented;

      expect(data).to.deep.equal({
        suggest_query: "h",
        suggest_query_request_types: ["subject", "creator", "title"],
        suggest_query_results: [{ type: "title", value: "Hest i flugt" }],
        session_id: "test",
      });

      expect(interception.response.body.errors).to.be.undefined;
    });

    cy.get("[data-cy=suggester-work-element]").first().click();

    // When a row is clicked data should be logged
    cy.wait("@apiMutation").then((interception) => {
      const data = interception.request.body.variables.input.suggest_click;

      expect(data).to.deep.equal({
        suggest_query: "h",
        suggest_query_hit: 1,
        suggest_query_request_types: ["subject", "creator", "title"],
        suggest_query_result: {
          type: "title",
          value: "Hest i flugt",
        },
        session_id: "test",
      });

      expect(interception.response.body.errors).to.be.undefined;
    });
  });
});

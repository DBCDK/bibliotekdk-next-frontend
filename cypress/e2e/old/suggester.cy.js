/**
 * @file
 * Test functionality of Suggester (via Storybook)
 */
const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiSimpleSearchPath");

describe("Suggester (Storybook version)", () => {
  beforeEach(() => {
    cy.visit("/iframe.html?id=search-suggester--header-suggester");
  });

  it("vises med container og 3 forslag ved input", () => {
    cy.get("[data-cy=suggester-input]").focus().type("a", { delay: 100 });
    cy.wait(300); // debounce-tolerance
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-container] ul li").should("have.length", 3);

    cy.get("[data-cy=suggester-title-element]").should("be.visible");
    cy.get("[data-cy=suggester-creator-element]").should("be.visible");
    cy.get("[data-cy=suggester-subject-element]").should("be.visible");
  });

  it("kan navigere med piletaster", () => {
    cy.get("[data-cy=suggester-input]").focus().type("a");
    cy.wait(300);
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-input]")
      .type("{downarrow}")
      .type("{downarrow}")
      .type("{downarrow}");

    cy.get("[data-cy=suggester-creator-element]")
      .parent()
      .should("have.attr", "aria-selected", "true");
  });

  it("kan vælge med Enter", () => {
    cy.get("[data-cy=suggester-input]").focus().type("a");
    cy.wait(300);

    cy.get("[data-cy=suggester-input]").type("{downarrow}").type("{enter}");

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Valgt: Ternet Ninja (type: Title)");
    });
  });

  it("kan vælge med Tab", () => {
    cy.get("[data-cy=suggester-input]").focus().type("a");
    cy.wait(300);

    cy.get("[data-cy=suggester-input]")
      .type("{downarrow}")
      .type("{downarrow}")
      .tab();

    cy.on("window:alert", (str) => {
      expect(str).to.equal("ninjaer selected");
    });
  });

  it("kan vælge med klik (desktop)", () => {
    cy.get("[data-cy=suggester-input]").focus().type("a");
    cy.wait(300);

    cy.get("[data-cy=suggester-creator-element]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Valgt: Anders Matthesen (type: Creator)");
    });
  });

  it("kan vælge med klik (mobile)", () => {
    cy.viewport(411, 731);

    cy.get("[data-cy=button-mobile]").click(); // aktiver mobiltilstand
    cy.get("[data-cy=suggester-input]").focus().type("a");
    cy.wait(300);

    cy.get("[data-cy=suggester-creator-element]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Valgt: Anders Matthesen (type: Creator)");
    });
  });

  it("viser historik på mobil", () => {
    cy.viewport(411, 731);
    cy.get("[data-cy=button-mobile]").click();
    cy.get("[data-cy=suggester-input]").clear();
    cy.wait(300);

    cy.get("[data-cy=suggester-container] ul li").should("have.length", 2);
  });

  it("rydder historik ved klik", () => {
    cy.viewport(411, 731);
    cy.get("[data-cy=button-mobile]").click();

    cy.get("[data-cy=suggester-clear-history]").should("be.visible").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Historik ryddet");
    });
  });
});

// Fremtidig test for logging/data collection
describe("Suggester data collect", () => {
  it.skip("should collect data from suggest API", () => {
    cy.visit(`${nextjsBaseUrl}`);
    cy.consentAllowAll();

    cy.intercept("POST", `${fbiApiPath}`, (req) => {
      if (req.body.query.startsWith("mutation")) {
        req.alias = "apiMutation";
      } else if (req.body.query.includes("suggest")) {
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

    cy.get("[data-cy=suggester-input]").type("h");
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

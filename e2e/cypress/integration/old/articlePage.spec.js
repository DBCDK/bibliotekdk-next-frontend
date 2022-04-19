const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("ArticlePage", () => {
  describe("News article (from drupal)", () => {
    before(() => {
      cy.visit("/iframe.html?id=articles-page--article-page&viewMode=story");
    });
    it(`Check if article has parsed body image`, () => {
      // check for onlye 1 figure
      cy.get("[data-cy=article-body]").find("figure").should("have.length", 1);
      // check img attributes
      cy.get("[data-cy=article-body]")
        .find("img")
        .invoke("attr", "src")
        .should("eq", "/img/bibdk-hero-scaled.jpeg");
      cy.get("[data-cy=article-body]")
        .find("img")
        .invoke("attr", "alt")
        .should("eq", "Læser bog i hængekøje");
      cy.get("[data-cy=article-body]")
        .find("img")
        .invoke("attr", "title")
        .should("eq", "Hængekøje hygge med bog");
      // check for onlye 1 figure caption
      cy.get("[data-cy=article-body]")
        .find("figcaption")
        .should("have.length", 1);
      // check for figure caption value match
      cy.get("[data-cy=article-body]")
        .find("figcaption")
        .contains("Hængekøje hygge med bog");
    });
    it(`Check if article has parsed body image`, () => {
      // check for onlye 1 figure
      cy.get("[data-cy=article-body]").find("figure").should("have.length", 1);
      // check img attributes
      cy.get("[data-cy=article-body]")
        .find("img")
        .invoke("attr", "src")
        .should("eq", "/img/bibdk-hero-scaled.jpeg");
      cy.get("[data-cy=article-body]")
        .find("img")
        .invoke("attr", "alt")
        .should("eq", "Læser bog i hængekøje");
      cy.get("[data-cy=article-body]")
        .find("img")
        .invoke("attr", "title")
        .should("eq", "Hængekøje hygge med bog");
      // check for onlye 1 figure caption
      cy.get("[data-cy=article-body]")
        .find("figcaption")
        .should("have.length", 1);
      // check for figure caption value match
      cy.get("[data-cy=article-body]")
        .find("figcaption")
        .contains("Hængekøje hygge med bog");
    });

    it(`Shows calculated read time`, () => {
      cy.contains("Læsetid: 3 min.");
    });

    it(`Shows correct category for news article (the ones from drupal)`, () => {
      cy.contains("Nyhed");
    });

    it("Print article", () => {
      cy.window().then((win) => {
        cy.stub(win, "print");
        cy.get("[data-cy=article-print]")
          .click()
          .then(() => {
            expect(win.print).to.be.calledOnce;
          });
      });
    });
  });

  describe("Infomedia article", () => {
    it(`Shows infomedia data`, () => {
      cy.visit(
        "/iframe.html?id=articles-page--infomedia-article&viewMode=story"
      );

      // Metadata
      cy.contains("Titel på Infomedia-artikel");
      cy.contains("Computerworld");
      cy.contains("Artiklen er leveret af Infomedia");
      cy.contains("Læsetid: 1 min.");
      cy.contains("En kategori");

      // Creators
      cy.contains("Gudrun Jensen");
      cy.contains("Anders Andersen");

      // Content
      cy.contains("Undertitel");
      cy.contains("Og en lil' rubrik er her");
      cy.contains("Artiklens indhold er her");
      cy.contains("Noget med fed");
      cy.contains("Noget med kursiv");

      // Logo and disclaimer
      cy.get("img[src$='/infomedia_logo.svg']").should("be.visible");
      cy.contains(
        "Alt materiale i Infomedia er omfattet af lov om ophavsret og må ikke kopieres uden særlig tilladelse."
      );
    });

    it("Print article", () => {
      cy.visit(
        "/iframe.html?id=articles-page--infomedia-article&viewMode=story"
      );

      cy.window().then((win) => {
        cy.stub(win, "print");
        cy.get("[data-cy=article-print]")
          .click()
          .then(() => {
            expect(win.print).to.be.calledOnce;
          });
      });
    });

    it.skip("Shows login prompt when not logged in", () => {
      cy.fixture("articlepublicdata.json").then((fixture) => {
        cy.intercept("POST", "/graphql", (req) => {
          if (
            req?.body?.variables?.workId === "work-of:870971-tsart:39160846"
          ) {
            req.reply(fixture);
          }
        });
      });

      cy.visit(
        `${nextjsBaseUrl}/infomedia/en-artikel/work-of:870971-tsart:39160846`
      );

      cy.contains("Titel på Infomedia-artikel");
      cy.contains("Få adgang til hele artiklen");
      cy.contains(
        "OBS: Ikke alle biblioteker giver adgang til artikler fra Infomedia"
      );
      cy.get("[data-cy=button-log-ind]").should("be.visible");
    });

    it.skip("Shows login prompt when logged in user is not granted access", () => {
      cy.fixture("articlepublicdata.json").then((fixture) => {
        cy.intercept("POST", "/graphql", (req) => {
          if (
            req?.body?.variables?.workId === "work-of:870971-tsart:39160846"
          ) {
            req.reply(fixture);
          }
        });
      });
      cy.fixture("branchUserParameters.json").then((fixture) => {
        cy.intercept("POST", "/graphql", (req) => {
          if (req?.body?.variables?.branchId) {
            req.reply(fixture);
          }
        });
      });
      cy.fixture("sessionUserParameters.json").then((fixture) => {
        cy.intercept("POST", "/graphql", (req) => {
          if (req.body.query.includes("session {")) {
            req.reply(fixture);
          }
        });
      });

      // Will mock user data
      cy.login();

      cy.visit(
        `${nextjsBaseUrl}/infomedia/en-artikel/work-of:870971-tsart:39160846`
      );

      cy.contains("Testbiblioteker giver ikke adgang til at læse artiklen");
      cy.contains(
        "Er du bruger ved et andet bibliotek? Så log ind der og se om de har abonnement."
      );
    });

    it.skip("Shows 404 when article does not exist", () => {
      cy.intercept("POST", "/graphql", (req) => {
        if (req?.body?.variables?.workId === "work-of:870971-tsart:39160846") {
          req.reply({
            errors: [
              {
                message: "Not Found",
                locations: [],
                path: ["work"],
              },
            ],
            data: {
              work: null,
            },
          });
        }
      });

      cy.visit(
        `${nextjsBaseUrl}/infomedia/en-artikel/work-of:870971-tsart:39160846`
      );

      cy.contains("404");
      cy.contains("This page could not be found");
    });
  });
});

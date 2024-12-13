const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiPath");

describe("Trace", () => {
  describe("simple search", () => {
    it(`TraceId from search response is available as URL parameter when clicking`, () => {
      cy.visit(nextjsBaseUrl);
      cy.consentAllowAll(); //allow cookies

      // Search
      cy.get('[data-cy="suggester-input"]').type("test").type("{enter}");

      // Click on first result
      cy.get(':nth-child(1) > [data-cy="result-row"]').click();

      // Check that tid is set as URL param
      cy.url()
        .should("include", "tid=")
        .then((url) => {
          const params = new URLSearchParams(url.split("?")[1]);
          const tid = params.get("tid");

          expect(tid).to.exist;
          expect(tid.length).to.be.greaterThan(20);
        });
    });

    it(`TraceId from did you mean is available as URL parameter when clicking`, () => {
      cy.visit(nextjsBaseUrl);
      cy.consentAllowAll(); //allow cookies

      // Search
      cy.get('[data-cy="suggester-input"]')
        .type("djennis jurgensen")
        .type("{enter}");

      cy.contains("Mente du");

      cy.get('[data-cy="did-you-mean-result"]').first().click();

      // Check that tid is set as URL param
      cy.url()
        .should("include", "tid=")
        .then((url) => {
          const params = new URLSearchParams(url.split("?")[1]);
          const tid = params.get("tid");

          expect(tid).to.exist;
          expect(tid.length).to.be.greaterThan(20);
        });
    });

    it(`URL parameter on material page is sent to FBI-API as x-caused-by header`, () => {
      cy.intercept("POST", fbiApiPath).as("apiRequest");
      cy.visit(
        `${nextjsBaseUrl}/materiale/elselskaber-dumper-paa-stribe-i-ny-stor-test_morten-zahle/work-of%3A870971-avis%3A139667638?type=artikel+%2F+artikel+%28online%29&tid=test`
      );
      cy.consentAllowAll(); //allow cookies

      // Check header on request to fbi-api
      cy.wait("@apiRequest").then((interception) => {
        const traceIdHeader = interception.request.headers["x-caused-by"];
        expect(traceIdHeader).to.equal("test");
      });
    });
    it("traceid on materialtypes in searchresult", () => {
      cy.visit(`${nextjsBaseUrl}/find?q.all=hest`);
      cy.consentAllowAll(); //allow cookies

      // get all the searchresults
      cy.get('[data-cy="search-result-materialtype"] a').first().click();
      cy.url()
        .should("include", "tid=")
        .then((url) => {
          const params = new URLSearchParams(url.split("?")[1]);
          const tid = params.get("tid");

          expect(tid).to.exist;
          expect(tid.length).to.be.greaterThan(20);
        });
    });
  });
  describe("complex search", () => {
    it(`TraceId on suggestion click`, () => {
      cy.visit(nextjsBaseUrl);
      cy.consentAllowAll(); //allow cookies

      //open advanced search
      cy.get('[data-cy="advanced-search-trigger"]').click();

      //type something and select first suggestion
      cy.get('[data-cy="advanced-search-inputfield-0"]').type("hest");
      cy.get('ul[role="listbox"] > li').first().click();
      //search
      cy.get('[data-cy="button-søg-avanceret"]').click();

      // Check that tid is set as URL param
      cy.url()
        .should("include", "tid=")
        .then((url) => {
          const params = new URLSearchParams(url.split("?")[1]);
          const tid = params.get("tid");

          expect(tid).to.exist;
          expect(tid.length).to.be.greaterThan(20);
        });
    });
    it(`TraceId when clicking on an item in complex search result`, () => {
      cy.visit(nextjsBaseUrl);
      cy.consentAllowAll(); //allow cookies

      cy.get('[data-cy="advanced-search-trigger"]').click();

      //type something and select first suggestion
      cy.get('[data-cy="advanced-search-inputfield-0"]').type("hest");
      cy.get('ul[role="listbox"] > li').first().click();
      //search
      cy.get('[data-cy="button-søg-avanceret"]').click();

      // Click on first result
      cy.get(':nth-child(1) > [data-cy="result-row"]').click();

      // Check that tid is set as URL param
      cy.url()
        .should("include", "tid=")
        .then((url) => {
          const params = new URLSearchParams(url.split("?")[1]);
          const tid = params.get("tid");

          expect(tid).to.exist;
          expect(tid.length).to.be.greaterThan(20);
        });
    });
  });

  it("traceid in inspiration belts", () => {
    cy.visit(`${nextjsBaseUrl}/inspiration/boeger?workTypes=literature`);
    cy.consentAllowAll(); //allow cookies


    //click on fist element in inspiration belt
    cy.get('[data-cy="inspiration-slider"]')
    .find('[data-cy="link"]') 
    .first() 
    .click();


    cy.url()
    .should("include", "tid=")
    .then((url) => {
      const params = new URLSearchParams(url.split("?")[1]);
      const tid = params.get("tid");

      expect(tid).to.exist;
      expect(tid.length).to.be.greaterThan(20);
    });


  });

  it("traceid universes in details", () => {
    cy.intercept("POST", fbiApiPath).as("apiRequest");
    cy.visit(
      `${nextjsBaseUrl}/materiale/aquaman_james-wan/work-of:870970-basis:46000242`
    );
    cy.consentAllowAll(); //allow cookies
    // get the recommender

    cy.get('[data-cy="series-or-universes"] a').each(($link) =>
      cy.wrap($link).should("have.attr", "href").and("include", "tid")
    );

    // goto a universe from details
    cy.get('[data-cy="series-or-universes"] a').first().click();

    cy.url()
      .should("include", "tid=")
      .then((url) => {
        const params = new URLSearchParams(url.split("?")[1]);
        const tid = params.get("tid");

        expect(tid).to.exist;
        expect(tid.length).to.be.greaterThan(20);
      });
  });

  it("traceid on links in recommender", () => {
    cy.visit(
      `${nextjsBaseUrl}/materiale/lille-hvide-fisk-holder-jul_guido-van-genechten/work-of%3A870970-basis%3A139056647`
    );
    cy.consentAllowAll(); //allow cookies
    // get the recommender
    cy.get('[data-cy="recommender"] article a').first().click();

    cy.url()
      .should("include", "tid=")
      .then((url) => {
        const params = new URLSearchParams(url.split("?")[1]);
        const tid = params.get("tid");

        expect(tid).to.exist;
        expect(tid.length).to.be.greaterThan(20);
      });
  });

  it(`traceid on series when clicked`, () => {
    cy.intercept("POST", fbiApiPath).as("apiRequest");
    cy.visit(
      `${nextjsBaseUrl}/materiale/den-vingede-hest-skar_adam-blade/work-of%3A870970-basis%3A28412932?type=bog`
    );
    cy.consentAllowAll(); //allow cookies
    cy.get('[data-cy="groupings-overview-link"]').click();

    cy.url()
      .should("include", "tid=")
      .then((url) => {
        const params = new URLSearchParams(url.split("?")[1]);
        const tid = params.get("tid");

        expect(tid).to.exist;
        expect(tid.length).to.be.greaterThan(20);
      });
  });

  it(`traceid from series response`, () => {
    cy.intercept("POST", fbiApiPath).as("apiRequest");
    cy.visit(
      `${nextjsBaseUrl}/serie/0ecb822cfa5f7b166d934355809ec8a13ba9a7ec9e03e28e8b07035b1aba010d?tid=fisk`
    );
    cy.consentAllowAll(); //allow cookies

    // Check header on request to fbi-api
    cy.wait("@apiRequest").then((interception) => {
      const traceIdHeader = interception.request.headers["x-caused-by"];
      expect(traceIdHeader).to.equal("fisk");
    });
  });

  it(`TraceId from suggest response is available as URL parameter when clicking`, () => {
    cy.visit(nextjsBaseUrl);
    cy.consentAllowAll(); //allow cookies

    // List suggestions
    cy.get('[data-cy="suggester-input"]').type("hest");

    // Click on first suggestion
    cy.get('ul[role="listbox"] li[data-suggestion-index="0"]').click();

    // Check that tid is set as URL param
    cy.url()
      .should("include", "tid=")
      .then((url) => {
        const params = new URLSearchParams(url.split("?")[1]);
        const tid = params.get("tid");

        expect(tid).to.exist;
        expect(tid.length).to.be.greaterThan(20);
      });
  });
});

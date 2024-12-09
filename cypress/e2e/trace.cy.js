const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiPath");

describe("Trace", () => {
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

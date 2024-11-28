const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiPath");

describe("Trace", () => {
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
        expect(tid).to.have.length(27);
      });
  });
  it.only(`URL parameter on material page is sent to FBI-API as x-parent-trace-id header`, () => {
    cy.visit(
      `${nextjsBaseUrl}/materiale/elselskaber-dumper-paa-stribe-i-ny-stor-test_morten-zahle/work-of%3A870971-avis%3A139667638?type=artikel+%2F+artikel+%28online%29&tid=test`
    );
    cy.consentAllowAll(); //allow cookies
    cy.intercept("POST", fbiApiPath).as("apiRequest");

    // Check header on request to fbi-api
    cy.wait("@apiRequest").then((interception) => {
      const traceIdHeader = interception.request.headers["x-parent-trace-id"];
      expect(traceIdHeader).to.equal("test");
    });
  });
});

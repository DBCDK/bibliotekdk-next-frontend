const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

it(`redirect to 404`, () => {
  // this is a normal request for a non existing work - we expect nothing serious to happen (200)
  cy.request(
    `${nextjsBaseUrl}/materiale/deutsches-dichten-und-denken-vom-mittelalter-zur-neuzeit-1270-1700-_gunther-muller/work-of%3A800010-katalog%3A99122644637705763`
  )
    .its("headers")
    .then((responseHeaders) => {
      console.log(responseHeaders);
      expect(responseHeaders).to.have.property("x-powered-by", "Next.js");
    });
  // this is a bot request (?isBot=true) - we expect a 404 redirect
  cy.request({
    url: `${nextjsBaseUrl}/materiale/deutsches-dichten-und-denken-vom-mittelalter-zur-neuzeit-1270-1700-_gunther-muller/work-of%3A800010-katalog%3A99122644637705763?isBot=true`,
    followRedirect: false, // turn off following redirects
    failOnStatusCode: false,
  }).then((resp) => {
    expect(resp.status).to.eq(404);
  });
});

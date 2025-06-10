const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

it(`redirect to 404`, () => {
  // this is a normal request for a non existing work - we expect nothing serious to happen (200)
  cy.request(
    `${nextjsBaseUrl}/materiale/deutsches-dichten-und-denken-vom-mittelalter-zur-neuzeit-1270-1700-_gunther-muller/work-of%3A800010-katalog%3A9912264463770576`
  ).then((resp) => {
    expect(resp.status).to.eq(200);
  });
  // this is a bot request (google bot) - we expect a 404 redirect
  // cy.request({
  //   url: `${nextjsBaseUrl}/materiale/deutsches-dichten-und-denken-vom-mittelalter-zur-neuzeit-1270-1700-_gunther-muller/work-of%3A800010-katalog%3A9912264463770576`,
  //   followRedirect: false, // turn off following redirects
  //   failOnStatusCode: false, // do not fail on statuscode bigger than 300
  //   headers: {
  //     "User-Agent":
  //       "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  //   },
  // }).then((resp) => {
  //   expect(resp.status).to.eq(404);
  // });
});

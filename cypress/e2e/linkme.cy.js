const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

// function getPage(path = "/") {
//   return cy.request({
//     url: `${nextjsBaseUrl}${path}`,
//     // bot
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
//     },
//   });
// }
describe(`linkme`, () => {
  it.skip(`redirects on no rec.id`, () => {
    const path = "/linkme.php/?isBot=true";
    const url = `${nextjsBaseUrl}${path}`;
    cy.visit(url);
    // we expect a redirect
    cy.contains("Siden blev ikke fundet");
  });

  it.skip("redirect on correct rec.id", () => {
    const path = "/linkme.php/?rec.id=874310-katalog%3ADBB0422141";
    const url = `${nextjsBaseUrl}${path}`;
    cy.visit(url);
    // we expect a redirect
    cy.contains("Grum : Roman fra Sø og Mose", { timeout: 10000 });
  });

  it("serverside redirect", () => {
    const path = "/linkme.php/?rec.id=874310-katalog%3ADBB0422141&isBot=true";
    const url = `${nextjsBaseUrl}${path}`;
    cy.visit(url);
    cy.contains("Grum");
  });
});

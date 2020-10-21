/**
 * @file
 * Test functionality of cards
 */
describe("Cards", () => {
  it(`Clicking card links to work page`, () => {
    cy.visit(
      "/iframe.html?id=cards--work-narrow-and-wide-cover&viewMode=story"
    );

    // When running in Storybook mode, clicking a link
    // will open an alert. We create a stub that record calls to alert.
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.get("[data-cy=work-card]")
      .first()
      .click()
      .then(() => {
        const expected = JSON.stringify({
          pathname: "/materiale/[title_author]/[workId]",
          query: {
            title_author: "ikke-i-kød-og-blod_ruth-rendell",
            workId: "work-id-1",
          },
        });
        expect(stub.getCall(0)).to.be.calledWith(expected);
      });
  });

  it(`Tabbing will focus cards`, () => {
    cy.visit(
      "/iframe.html?id=cards--work-narrow-and-wide-cover&viewMode=story"
    );

    // When running in Storybook mode, clicking a link
    // will open an alert. We create a stub that record calls to alert.
    const stub = cy.stub();
    cy.on("window:alert", stub);

    // Tab to the second work card and click
    cy.get("body")
      .tabs(2)
      .click()
      .then(() => {
        const expected = JSON.stringify({
          pathname: "/materiale/[title_author]/[workId]",
          query: {
            title_author: "blodrøde-spor_andrew-taylor-(f.-1951)",
            workId: "work-id-2",
          },
        });
        expect(stub.getCall(0)).to.be.calledWith(expected);
      });
  });
});

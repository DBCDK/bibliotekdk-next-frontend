/**
 * @file
 * Test functionality of cards
 */
describe("Cards", () => {
  it(`Clicking card links to work page`, () => {
    cy.visit(
      "/iframe.html?id=base-cards--work-narrow-and-wide-cover&viewMode=story"
    );

    cy.get("[data-cy=work-card]").first().click();

    // Check URL path is as expected
    cy.get("[data-cy=router-pathname]").should(
      "have.text",
      "/materiale/[title_author]/[workId]"
    );

    // Check URL query parameters are as expected
    cy.get("[data-cy=router-query]").then((el) => {
      expect(JSON.parse(el.text())).to.deep.equal({
        title_author: "ikke-i-koed-og-blod_ruth-rendell",
        workId: "work-id-1",
      });
    });
  });

  it(`Tabbing will focus cards`, () => {
    cy.visit(
      "/iframe.html?id=base-cards--work-narrow-and-wide-cover&viewMode=story"
    );

    // Tab to the second work card and click
    cy.get("body").tabs(2).click();

    // Check URL path is as expected
    cy.get("[data-cy=router-pathname]").should(
      "have.text",
      "/materiale/[title_author]/[workId]"
    );

    // Check URL query parameters are as expected
    cy.get("[data-cy=router-query]").then((el) => {
      expect(JSON.parse(el.text())).to.deep.equal({
        title_author: "blodroede-spor_andrew-taylor-f-1951-",
        workId: "work-id-2",
      });
    });
  });
});

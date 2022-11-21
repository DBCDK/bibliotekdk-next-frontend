describe("Series", () => {
  before(function () {
    cy.visit(
      "/iframe.html?id=work-recommendations--wrapped-recommendations-slider&viewMode=story"
    );
  });

  it(`Verify title and creator are shown`, () => {
    cy.contains("Minder om");
    cy.get("a").should("have.length", 2);

    cy.get("a").eq(0).contains("recommend.result[0].work.titles.main[0]");
    cy.get("a").eq(0).contains("recommend.result[0].work.creators[0].display");

    cy.get("a").eq(1).contains("recommend.result[1].work.titles.main[0]");
    cy.get("a").eq(1).contains("recommend.result[1].work.creators[0].display");

    cy.get("a")
      .eq(0)
      .should(
        "have.attr",
        "href",
        "/materiale/recommend-result-0-work-titles-main-0-_recommend-result-0-work-creators-0-display/recommend.result%5B0%5D.work.workId?type=recommend.result%5B0%5D.work.manifestations.all%5B0%5D.materialTypes%5B0%5D.specific"
      );
  });
});

describe("Series", () => {
  before(function () {
    cy.visit(
      "/iframe.html?id=work-series--wrapped-series-slider&viewMode=story"
    );
  });

  it(`Verify title and creator are shown`, () => {
    cy.contains("I samme serie");
    cy.get("a").should("have.length", 2);

    cy.get("a").eq(0).contains("work.seriesMembers[0].titles.main[0]");
    cy.get("a").eq(0).contains("work.seriesMembers[0].creators[0].display");

    cy.get("a").eq(1).contains("work.seriesMembers[1].titles.main[0]");
    cy.get("a").eq(1).contains("work.seriesMembers[1].creators[0].display");

    cy.get("a")
      .eq(0)
      .should(
        "have.attr",
        "href",
        "/materiale/work-seriesmembers-0-titles-main-0-_work-seriesmembers-0-creators-0-display/work.seriesMembers%5B0%5D.workId?type=work.seriesMembers%5B0%5D.manifestations.all%5B0%5D.materialTypes%5B0%5D.specific"
      );
  });
});

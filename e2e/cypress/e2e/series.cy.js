describe("Series", () => {
  before(function () {
    cy.visit(
      "/iframe.html?id=work-series--wrapped-series-slider&viewMode=story"
    );
  });

  it(`Verify title and creator are shown`, () => {
    cy.contains("I samme serie");
    cy.get("a").should("have.length", 2);

    cy.get("a").eq(0).contains("work.seriesMembers[0].titles.full[0]");
    cy.get("a").eq(0).contains("work.seriesMembers[0].creators[");

    cy.get("a").eq(1).contains("work.seriesMembers[1].titles.full[0]");
    cy.get("a").eq(1).contains("work.seriesMembers[1].creators[");

    cy.get("a")
      .eq(0)
      .should("have.attr", "href")
      .and(
        "contain",
        "/materiale/work-seriesmembers-0-titles-full-0-work-seriesmembers-0-titles-full-1-_work-seriesmembers-0-creators"
      )
      .and("contain", "-display/work.seriesMembers[0].workId");
  });
});

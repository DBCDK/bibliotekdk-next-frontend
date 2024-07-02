describe("TitleRenderer", () => {
  it(`TitleRenderer multiple languages should have 'flere sprog' or 'multiple languages'`, () => {
    cy.visit(
      "/iframe.html?id=work-overview-titlerenderer--title-renderer-multiple-languages"
    );

    cy.get("[data-cy=title-overview]").should("exist");

    cy.contains("Hugo i Sølvskoven").should("exist");
    cy.contains("Hugo og Rita fra Sølvskoven").should("exist");
    cy.contains("flere sprog").should("exist");
  });
  it(`TitleRenderer only danish should have no language`, () => {
    cy.visit(
      "/iframe.html?id=work-overview-titlerenderer--title-renderer-only-danish"
    );

    cy.get("[data-cy=title-overview]").should("exist");

    cy.contains("Hugo i Sølvskoven").should("exist");
    cy.contains("Hugo og Rita fra Sølvskoven").should("exist");
    cy.contains("flere sprog").should("not.exist");
    cy.contains("dansk").should("not.exist");
  });
  it(`TitleRenderer tvSeries should show season, disc, episode, episodeTitles .... if present`, () => {
    cy.visit(
      "/iframe.html?id=work-overview-titlerenderer--title-renderer-tv-series"
    );

    cy.get("[data-cy=title-overview]").should("exist");

    cy.contains("Seinfeld").should("exist");
    cy.contains("Sæson 3, disc 1, Episodes 1-5").should("exist");
  });
  it(`TitleRenderer 1 non danish should have 1 language`, () => {
    cy.visit(
      "/iframe.html?id=work-overview-titlerenderer--title-renderer-1-non-danish"
    );

    cy.get("[data-cy=title-overview]").should("exist");

    cy.contains("Hugo i Sølvskoven").should("exist");
    cy.contains("Hugo og Rita fra Sølvskoven").should("exist");
    cy.contains("engelsk").should("exist");
  });
  it(`TitleRenderer not literature should not have language`, () => {
    cy.visit(
      "/iframe.html?id=work-overview-titlerenderer--title-renderer-non-literature"
    );

    cy.get("[data-cy=title-overview]").should("exist");

    cy.contains("Hugo i Sølvskoven").should("exist");
    cy.contains("Hugo og Rita fra Sølvskoven").should("exist");
    cy.contains("flere sprog").should("not.exist");
    cy.contains("dansk").should("not.exist");
    cy.contains("engelsk").should("not.exist");
  });
});

describe("Localizations", () => {
  it("Show error message when temporarily closed", () => {
    cy.visit("/iframe.html?id=localizations-base--localizations-base-flow");
    cy.contains("Localizations", { timeout: 15000 }).should("exist");
    cy.get("a", { timeout: 10000 }).first().should("exist").click();

    cy.contains("Se hvor materialet er på hylden");

    cy.get("[id=LocalizationsBase__search]").type("rap");
    cy.contains("BalleRipRapRup", { timeout: 10000 }).click();
    cy.contains("Ripper Bib", { timeout: 10000 }).click();

    cy.contains(
      "OBS: Biblioteket modtager ikke bestillinger fra bibliotek.dk."
    );

    // link to openinghours
    cy.contains("Se bibliotekets åbningstider");
  });

  it("Show holdings on shelf", () => {
    cy.visit("/iframe.html?id=localizations-base--localizations-base-flow");
    cy.contains("Localizations", { timeout: 15000 }).should("exist");
    cy.get("a", { timeout: 10000 }).first().should("exist").click();

    cy.contains("Se hvor materialet er på hylden");

    cy.get("[id=LocalizationsBase__search]").type("rap");
    cy.contains("BalleRipRapRup", { timeout: 10000 }).click();

    // BalleRipRapRup - Rapper Bib - Branch with holdings on loan
    cy.contains("h2", "BalleRipRapRup");
    cy.contains("Rapper Bib - Branch with holdings on loan").click();
    cy.contains("h2", "Rapper");
    cy.contains("2 på hylden, men udlånes ikke");
    cy.contains(
      "Husk at du kan bestille online og hente på dit foretrukne bibliotek, uanset hvor materialet befinder sig."
    );
  });
});

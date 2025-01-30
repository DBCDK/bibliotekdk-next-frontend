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

  it.only("Show holdings with different statuses", () => {
    cy.visit("/iframe.html?id=localizations-base--localizations-base-flow");
    cy.contains("Localizations", { timeout: 15000 }).should("exist");
    cy.get("a", { timeout: 10000 }).first().should("exist").click();

    cy.contains("Se hvor materialet er på hylden");

    cy.get("[id=LocalizationsBase__search]").type("rap");
    cy.contains("BalleRipRapRup", { timeout: 10000 }).click();

    const branches = [
      { name: "Ripper Bib", holdings: "2 på hylden" },
      { name: "Rapper Bib", holdings: "Ikke på hylden" },
      { name: "Rupper Bib", holdings: "Afdelingen har ikke materialet" },
      { name: "Bubber Bib", holdings: "På hylden, men udlånes ikke" },
      {
        name: "Bobber Bib",
        holdings: "1 på hylden, men udlånes kun til egne brugere",
      },
    ];

    // Iterér over branch-listen og valider hver entry
    branches.forEach((branch) => {
      cy.contains(branch.name)
        .parent() // Find parent container
        .contains(branch.holdings); // Check that holdings status is correct
    });
  });
});

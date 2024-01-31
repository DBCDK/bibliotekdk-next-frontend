describe("Localizations", () => {
  it("Base flow", () => {
    cy.visit("/iframe.html?id=localizations-base--localizations-base-flow");

    cy.contains("Localizations", { timeout: 15000 }).should("exist");

    cy.get("a", { timeout: 10000 }).first().should("exist").click();

    //// BalleRipRapRup
    // BalleRipRapRup - Rapper Bib - Branch with 2 holdings on shelf
    cy.contains("BalleRipRapRup", { timeout: 10000 }).click();
    cy.contains("h2", "BalleRipRapRup");
    cy.contains("Ripper Bib - Branch with 2 holdings on shelf").click();
    cy.contains("h2", "Ripper");
    cy.contains("2 på hylden");
    cy.contains("button", "Bestil til afhentning på denne afdeling");
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    // BalleRipRapRup - Rapper Bib - Branch with holdings on loan
    cy.contains("h2", "BalleRipRapRup");
    cy.contains("Rapper Bib - Branch with holdings on loan").click();
    cy.contains("h2", "Rapper");
    cy.contains("Bestil nu og afhent senere");
    cy.contains(
      "Husk at du kan bestille online og hente på dit foretrukne bibliotek, uanset hvor materialet befinder sig."
    );
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    // BalleRipRapRup - Rupper Bib - Branch with no holdings but is public library
    cy.contains("h2", "BalleRipRapRup");
    cy.contains(
      "Rupper Bib - Branch with no holdings but is public library"
    ).click();
    cy.contains("h2", "Rupper");
    cy.contains("Bestil nu og afhent s");
    cy.contains(
      "Husk at du kan bestille online og hente på dit foretrukne bibliotek, uanset hvor materialet befinder sig."
    );

    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    //// Grullinger
    cy.contains("Hjemme");
    cy.contains("Grullinger", { timeout: 10000 }).click();
    cy.contains("h2", "Grullinger");
    cy.contains("Bestil nu og afhent senere");
    cy.contains("Supplerende status");
    cy.contains(
      "Grullinger har materialet på hylden, men har ikke oplyst hvor"
    );
    cy.contains("Grull Ly - Branch", { timeout: 10000 }).click({ force: true });
    cy.contains("Bestil nu og afhent senere");
    cy.contains("Se detaljeret status hos Grullinger");
    cy.contains(
      "Husk at du kan bestille online og hente på dit foretrukne bibliotek, uanset hvor materialet befinder sig."
    );
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    cy.should("not.contain", "Grull Ly ServicePoint -");
    cy.contains("Grull Ly TemporarilyClosed", { timeout: 10000 }).click({
      force: true,
    });
    cy.contains("OBS: Biblioteket modtager ikke bestillinger");
    cy.contains("Grull Ly TemporarilyClosed er lukket");

    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    //// Special FFUs
    cy.contains("Hjemme på én eller flere afdelinger");
    cy.contains("Special FFUs", { timeout: 10000 }).click();

    // Herlige Lev
    cy.contains("På hylden", { timeout: 10000 });
    cy.contains("Herlige Lev FFU", { timeout: 10000 }).click();
    cy.contains("På hylden");
    cy.contains("Bestil til afhentning på denne afdeling");
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    // Senge Loese
    cy.contains("Forventet udlånt til", { timeout: 10000 });
    cy.contains("Senge Loese FFU", { timeout: 10000 }).click();
    cy.contains("Forventet udlånt til");
    cy.contains("Bestil til afhentning på denne afdeling");
    cy.contains(
      "Husk at du kan bestille online og hente på dit foretrukne bibliotek, uanset hvor materialet befinder sig."
    );
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    // Hede Huse
    cy.contains("Hede Huse FFU", { timeout: 10000 }).click();
    cy.contains("Modtager ikke bestillinger");
    cy.contains("OBS: Biblioteket modtager ikke bestillinger");
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    // Ulvs Hale
    cy.contains("Vi har ikke status for disse afdelinger");
    cy.contains("Se detaljeret status hos Special FFUs");
    cy.contains("Ulvs Hale FFU", { timeout: 10000 }).click();
    cy.contains("Bestil nu og afhent senere");
    cy.contains("Bestil til afhentning på denne afdeling");
    cy.contains(
      "Husk at du kan bestille online og hente på dit foretrukne bibliotek, uanset hvor materialet befinder sig."
    );
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    cy.contains("BalleRipRapRup");
    cy.contains("Grullinger");
    cy.contains("Special FFUs");

    //// Animal Group HoldingItems Holder FFUs
    cy.contains("Hjemme på 2 eller flere afdelinger");
    cy.contains("Animal Group HoldingItems Holder FFUs", {
      timeout: 10000,
    }).click();
    cy.contains("1 på hylden");
    cy.contains("Forventet udlånt til");
    cy.contains("Vi har ikke status for disse afdelinger");
    cy.contains("Se detaljeret status hos");

    // Ant Colony
    cy.contains("Ant Colony", { timeout: 10000 }).click();
    cy.contains("1 på hylden");
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    cy.contains("Rhinoceroses Crash", { timeout: 10000 }).click();
    cy.contains("Forventet udlånt til");
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    //// Duo without holdings FFUs
    cy.contains("Hjemme");
    cy.contains("Duo without holdings FFUs", {
      timeout: 10000,
    }).click();
    cy.contains(
      "Er hjemme på en eller flere afdelinger, men vi har ikke detaljer om hvilke afdelinger"
    );

    cy.contains("Vi har ikke status for disse afdelinger");
    cy.contains("Se detaljeret status hos");

    cy.contains("Yang FFU", { timeout: 10000 }).click();
    cy.contains("Forventet udlånt til");

    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });

    cy.contains("Ying FFU", { timeout: 10000 }).click();
    cy.contains("Bestil nu og afhent senere");

    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });
    cy.contains("Tilbage", { timeout: 10000 }).click({ force: true });
  });
});

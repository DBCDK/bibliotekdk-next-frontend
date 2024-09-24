/**
 * test the details section
 */

describe("Details", () => {
  it(`should have details for book`, () => {
    cy.visit("/iframe.html?id=work-details--wrapped-details-section");

    cy.contains("Details section", { timeout: 15000 }).should("exist");
    cy.contains("Seneste udgave, Bog", { timeout: 15000 }).should("exist");

    cy.get("[data-cy=text-sprog]").should("have.text", "Sprog");
    cy.get("[data-cy=text-længde]").should("have.text", "Længde");
    cy.get("[data-cy=text-udgivet]").should("have.text", "Udgivet");
    cy.get("[data-cy=text-bidrag]").should("have.text", "Bidrag");
    cy.get("[data-cy=creator-contributor-text-helper")
      .should("exist")
      .first()
      .should("exist")
      /*.should((ele) => {
        expect(ele).to.have.css("font-weight", "700");
      })*/
      .parent()
      .should("contain", "roles")
      .should("contain", "function.singular");

    cy.get("[data-cy=text-genre-form]").should("have.text", "genre/form");

    cy.get("[data-cy*=text-lix]").should("have.text", "lix: 2222");
  });

  it(`should have details for movie`, () => {
    cy.visit("/iframe.html?id=work-details--wrapped-details-section-movie");

    cy.contains("Details section", { timeout: 15000 }).should("exist");
    cy.contains("Seneste udgave, Film (dvd)", { timeout: 15000 }).should(
      "exist"
    );

    cy.get("[data-cy=text-sprog]").should("have.text", "Sprog");
    cy.get("[data-cy=text-længde]").should("have.text", "Længde");
    cy.get("[data-cy=text-udgivet]").should("have.text", "Udgivet");
    cy.get("[data-cy=text-skuespillere]").should("have.text", "Skuespillere");
    cy.get("[data-cy=text-dk5]").should("have.text", "dk5");

    // dk5 is now a link :)
    cy.get("[data-cy=text-dk5]")
      .next("div")
      .find("a")
      .should("have.attr", "href")
      .should("include", "/avanceret?fieldSearch");

    cy.contains("Nikolaj Lie Kaas");
    cy.contains("William Steig (instruktør)");
    cy.contains("Anders Thomas Jensen");
    cy.should("not.contain", "(ophav)");

    cy.get("[data-cy=text-genre-form]")
      .next("div")
      .first()
      .should("have.text", "actionfilm, thriller, science fiction");
  });

  it(`should have details for article`, () => {
    cy.visit("/iframe.html?id=work-details--wrapped-details-section-artikel");

    cy.contains("Details section", { timeout: 15000 }).should("exist");
    cy.contains("Seneste udgave, Artikel", { timeout: 15000 }).should("exist");

    cy.get("[data-cy=text-sprog]").should("exist");
    cy.get("[data-cy=text-længde]").should("exist");
    cy.get("[data-cy=text-udgivet]").should("exist");
    cy.get("[data-cy=text-bidrag]").should("exist");
  });

  it("should not have details where there is no manifestation of type (should not happen)", () => {
    cy.visit(
      "/iframe.html?id=work-details--wrapped-details-section-no-manifestations-no-details"
    );

    cy.contains("Details section", { timeout: 15000 }).should("exist");
    cy.contains("Seneste udgave, ", { timeout: 15000 }).should("not.exist");
  });
});

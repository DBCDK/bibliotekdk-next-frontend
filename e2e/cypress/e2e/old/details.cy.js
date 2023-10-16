/**
 * test the details section
 */

describe("Details-Movie", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-details--wrapped-details-section-movie");
  });

  // some simple tests - at least they are there
  it(`Elements in details present`, () => {
    cy.get("[data-cy=text-sprog]").should("have.text", "Sprog");
    cy.get("[data-cy=text-længde]").should("have.text", "Længde");
    cy.get("[data-cy=text-udgivet]").should("have.text", "Udgivet");
    cy.get("[data-cy=text-skuespillere]").should("have.text", "Skuespillere");

    cy.contains("Nikolaj Lie Kaas");
    cy.contains("William Steig (instruktør)");
    cy.contains("Anders Thomas Jensen");
    cy.should("not.contain", "(ophav)");

    cy.get("[data-cy=text-genre-form]")
      .next("div")
      .first()
      .should("have.text", "actionfilm, thriller, science fiction");

    cy.get("[data-cy=section-title]")
      .find("p")
      .should("have.text", "Seneste udgave, film (dvd)");
  });
});

describe("Details", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-details--wrapped-details-section");
  });

  // some simple tests - at least they are there
  it(`Elements in details present`, () => {
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

    cy.get("[data-cy=section-title]")
      .find("p")
      .should("have.text", "Seneste udgave, bog");
  });
});

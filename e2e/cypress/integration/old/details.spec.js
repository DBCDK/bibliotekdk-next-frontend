/**
 * test the details section
 */

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
      .should((ele) => {
        expect(ele).to.have.css("font-weight", "700");
      })
      .parent()
      .should("contain", "roles")
      .should("contain", "function.singular");

    cy.get("[data-cy=genre-form-container]").find("p").should("have.length", 2);

    cy.get("[data-cy=genre-form-container]")
      .find("p")
      .eq(1)
      .should("have.text", "actionfilm, thriller, science fiction");
  });
});

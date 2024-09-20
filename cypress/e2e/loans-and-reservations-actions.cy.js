describe(`Loans and reservations deletion and renewal`, () => {
  it("Desktop - Renew and delete fails as expected", () => {
    cy.visit(
      "iframe.html?args=&id=profile-loans-and-reservations--loans-and-reservations-story-actions&viewMode=story"
    );

    //RENEW
    cy.get("[data-cy=loan-3]").scrollIntoView().should("exist").click();
    cy.contains("Kan ikke fornyes").should("exist");

    //DELETE (should be its own test, but kept failing)
    cy.get('[data-cy="order-button"]').first().should("exist").click();
    cy.get('[data-cy="button-slet"]').should("exist").click();

    cy.contains(
      "Noget gik galt, da reserveringen skulle slettes. Prøv igen."
    ).should("exist");
  });
});

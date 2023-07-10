describe("deleteOrderModal", () => {
  it(`Warning modal when book is ready for pick up`, () => {
    cy.visit(
      "/iframe.html?id=modal-deleteorder--delete-order-ready-to-pick-up"
    );
    cy.get("h4").contains("Slet reservering");
    cy.get("div").contains("Er du sikker på, at du vil slette reserveringen?");
    cy.get("div").contains(
      "Hvis du sletter reserveringen, er materialet ikke længere sat til side til dig"
    );
    cy.get("button").contains("Slet");
    cy.get("button").contains("Fortryd");
    cy.get("[data-cy=text-luk]").contains("Luk");
  });

  it(`Warning modal when user is in queue`, () => {
    cy.visit("/iframe.html?id=modal-deleteorder--delete-order-in-queue");
    cy.get("div").contains("Du mister din plads i køen.");
  });
});

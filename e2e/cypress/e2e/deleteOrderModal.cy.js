describe("deleteOrderModal", () => {
  it(`Warning modal when book is ready for pick up`, () => {
    cy.visit(
      "/iframe.html?id=modal-deleteorder--delete-order-ready-to-pick-up"
    );
    cy.get("h4").contains("Slet reservering?");
    cy.get("[data-cy=delete-order-confirmation-1]").should(
      "have.text",
      "Er du sikker på, at du vil slette din reservering:"
    );
    cy.get("[data-cy=delete-order-confirmation-2]").should(
      "have.text",
      "Hvis du sletter reserveringen, er materialet ikke længere sat til side til dig."
    );

    //get first paragraph in  a list of paragraphs and check text
    //test material-title data-cy element if it exists and contains text
    cy.get("[data-cy=material-title]")
      .should("exist")
      .contains("Citronbjerget");
    cy.get("button").contains("Slet");
    cy.get("button").contains("Fortryd");
    cy.get("[data-cy=text-luk]").contains("Luk");
  });

  it(`Warning modal when user is in queue`, () => {
    cy.visit("/iframe.html?id=modal-deleteorder--delete-order-in-queue");
    cy.get("[data-cy=delete-order-confirmation-2]").should(
      "have.text",
      "Du mister din plads i køen."
    );
  });
});

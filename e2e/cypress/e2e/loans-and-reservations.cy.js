describe(`Loans and reservations`, () => {
  it("Renders properly", async () => {
    await cy.visit(
      "iframe.html?args=&id=profile-loans-and-reservations--loans-and-reservations-story&viewMode=story"
    );

    cy.get("[data-cy=debt-0]").should("exist");
    cy.get("[data-cy=order-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
    });

    cy.get("[data-cy=loan-0]").should("exist");
    cy.get("[data-cy=loan-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
      cy.get("[data-cy=loan-button]").should("exist");
    });

    cy.get("[data-cy=order-0]").should("exist");
    cy.get("[data-cy=order-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
      cy.get("[data-cy=order-button]").should("exist");
    });
  });

  it("Mobile renders properly", async () => {
    await cy.viewport("iphone-6");

    cy.get("[data-cy=debt-0]").should("exist");
    cy.get("[data-cy=order-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
    });

    cy.get("[data-cy=loan-0]").should("exist");
    cy.get("[data-cy=loan-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
      cy.get("[data-cy=loan-button]").should("exist");
    });

    cy.get("[data-cy=order-0]").should("exist");
    cy.get("[data-cy=order-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
      cy.get("[data-cy=order-button]").should("exist");
    });
  });

  it("Opens modal & shows correct content", async () => {
    await cy.viewport("iphone-6");
    cy.get("[data-cy=loan-0]").click();

    cy.get("[data-cy=loans-and-reservations-modal]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=loan-button]").should("exist");
      cy.get("[data-cy=dyn-cont-loan-return-date]").should("exist");
      cy.get("[data-cy=dyn-cont-loan-message]").should("exist");
    });
  });
});

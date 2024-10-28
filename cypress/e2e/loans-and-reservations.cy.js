describe.skip(`Loans and reservations`, () => {
  //TODO https://dbcjira.atlassian.net/browse/BIBDK2021-2027
  beforeEach(() => {
    cy.visit(
      "iframe.html?args=&id=profile-loans-and-reservations--loans-and-reservations-story&viewMode=story"
    );
  });
  it("Renders properly", () => {
    cy.get("[data-cy=articleRow-debt-0]").should("exist");
    cy.get("[data-cy=articleRow-debt-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
    });

    cy.get("[data-cy=articleRow-loan-0]").should("exist");
    cy.get("[data-cy=articleRow-loan-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
      cy.get("[data-cy=loan-0]").should("exist");
    });

    cy.get("[data-cy=articleRow-order-0]").should("exist");
    cy.get("[data-cy=articleRow-order-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
      cy.get("[data-cy=order-button]").should("exist");
    });
  });

  it("Mobile renders properly", () => {
    cy.get("[data-cy=articleRow-debt-0]").should("exist");
    cy.viewport("iphone-6");

    cy.get("[data-cy=articleRow-debt-0]").should("exist");
    cy.get("[data-cy=articleRow-debt-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
    });

    cy.get("[data-cy=articleRow-loan-0]").should("exist");
    cy.get("[data-cy=articleRow-loan-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
      cy.get("[data-cy=loan-0]").should("exist");
    });

    cy.get("[data-cy=articleRow-order-0]").should("exist");
    cy.get("[data-cy=articleRow-order-0]").within(() => {
      cy.get("h3").should("exist");
      cy.get("[data-cy=creator]").should("exist");
      cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
      cy.get("[data-cy=dynamic-column]").should("exist");
      cy.get("[data-cy=order-button]").should("exist");
    });
  });

  it("Opens modal & shows correct content", () => {
    cy.viewport("iphone-6");
    cy.get("[data-cy=articleRow-loan-0]").click();

    cy.get("[data-cy=loans-and-reservations-modal]")
      .should("exist")
      .within(() => {
        cy.get("h3").should("exist");
        cy.get("[data-cy=creator]").should("exist");
        cy.get("[data-cy=materialtype-and-creationyear]").should("exist");
        cy.get("[data-cy=loan-button]").should("exist");
        cy.get("[data-cy=dyn-cont-loan-return-date]").should("exist");
        cy.get("[data-cy=dyn-cont-loan-message]").should("exist");
      });
  });
  it("Fjernlån render properly", () => {
    cy.visit(
      "iframe.html?args=&id=profile-loans-and-reservations--loans-and-reservations-with-fjern-laan-story&viewMode=story"
    );

    cy.get("[data-cy=text-jeg-er-et-fjernlaan-1]").should("exist");
    cy.get("[data-cy=creator]")
      .should("exist")
      .should("contain", "Munk Jensen, Sanne");
    cy.get("[data-cy=link]").first().should("not.have.attr", "href");

    cy.get("[data-cy=text-jeg-er-et-fjernlaan-2]").should("exist");
    cy.get("[data-cy=creator]")
      .should("exist")
      .should("contain", "Carlander, Troels B.");
    cy.get("[data-cy=link]").eq(2).should("not.have.attr", "href"); // 3 link in index 2 is the fjernlån under orders
  });
});

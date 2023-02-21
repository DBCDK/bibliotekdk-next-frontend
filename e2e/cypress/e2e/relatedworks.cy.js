describe("Related works", () => {
  it("desktop", () => {
    cy.visit("/iframe.html?id=work-relatedworks--related-works-physical-book");

    cy.viewport(1920, 1080);

    cy.contains("Hugo i Sølvskoven 2");
    cy.contains("Hugo i Sølvskoven 3");

    cy.get("[data-cy=right_arrow]", { timeout: 10000 }).click();
    cy.contains("Hugo i Sølvskoven 2").should("not.be.visible");
    cy.contains("Hugo i Sølvskoven 3");
    cy.contains("Hugo i Sølvskoven 3½");
    cy.contains("Hugo i Sølvskoven 4");

    cy.get("[data-cy=right_arrow]", { timeout: 10000 }).click();
    cy.contains("Hugo i Sølvskoven 3").should("not.be.visible");
    cy.contains("Hugo i Sølvskoven 3½").should("not.be.visible");
    cy.contains("Hugo i Sølvskoven 4");
    cy.contains("Hugo i Sølvskoven 5");
    cy.contains("Hugo i Sølvskoven 6");
  });

  it("mobile", () => {
    cy.visit("/iframe.html?id=work-relatedworks--related-works-physical-book");

    cy.viewport(750, 1080);

    cy.get("[data-cy=right_arrow]").should("not.be.visible");
    cy.get("[data-cy=left_arrow]").should("not.be.visible");
  });
});

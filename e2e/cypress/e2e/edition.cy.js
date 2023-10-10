describe("Edition", () => {
  it(`Single Edition with year, publisher, ordertext`, () => {
    cy.visit("/iframe.html?id=modal-edition--edition-single-manifestation");

    // there should be additional text for specific edition
    cy.get("[data-cy=additional_edition_info]").should(
      "contain",
      "3001, Sølvbakke, 109. udgave"
    );

    cy.get("[data-cy=text-bestil-udgave]").should("exist");
    cy.get("[data-cy=text-udgave-underordnet]").should("not.exist");
  });

  it(`Single Edition with year, publisher, no ordertext`, () => {
    cy.visit(
      "/iframe.html?id=modal-edition--edition-single-manifestation-no-order-txt"
    );

    // there should be additional text for specific edition
    cy.get("[data-cy=additional_edition_info]").should(
      "contain",
      "3001, Sølvbakke, 109. udgave"
    );

    cy.get("[data-cy=text-bestil-udgave]").should("not.exist");
    cy.get("[data-cy=text-udgave-underordnet]").should("not.exist");
  });

  it(`Any Edition with no year, publisher, with ordertext`, () => {
    cy.visit("/iframe.html?id=modal-edition--edition-any-manifestation");

    // there should be additional text for specific edition
    cy.get("[data-cy=additional_edition_info]").should("not.exist");

    cy.get("[data-cy=text-bestil-udgave]").should("not.exist");
    cy.get("[data-cy=text-udgave-underordnet]").should("exist");
  });

  it(`Any Edition no year, publisher, ordertext`, () => {
    cy.visit(
      "/iframe.html?id=modal-edition--edition-any-manifestation-no-order-txt"
    );

    // there should be additional text for specific edition
    cy.get("[data-cy=additional_edition_info]").should("not.exist");
    cy.get("[data-cy=text-bestil-udgave]").should("not.exist");
    cy.get("[data-cy=text-udgave-underordnet]").should("not.exist");
  });

  it.skip(`Any Edition no year, publisher, with ordertext, Digital copy`, () => {
    cy.visit(
      "/iframe.html?id=modal-edition--edition-any-manifestation-digital-copy"
    );

    // there should be additional text for specific edition
    cy.get("[data-cy=additional_edition_info]").should("not.exist");
    cy.get("[data-cy=text-bestil-udgave]").should("not.exist");
    cy.get("[data-cy=text-udgave-underordnet]").should("exist");

    cy.get("[data-cy=text-digital-kopi]").should("exist");
  });
});

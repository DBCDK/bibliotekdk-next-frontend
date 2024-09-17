describe("CoverCarousel", () => {
  it(`CoverCarousel`, () => {
    cy.visit(
      "/iframe.html?id=work-covercarousel--cover-carousel-multiple-covers"
    );

    // there should be additional text for specific edition
    cy.get("[data-cy=cover_carousel]")
      .should("exist")
      .find("img")
      .should("exist");

    cy.contains("101. udgave");
    cy.should("not.contain", "102. udgave");

    cy.get("[data-cy=left_arrow]").should("have.attr", "aria-hidden");
    cy.get("[data-cy=right_arrow]").should("exist").focus().type(" ");

    cy.contains("102. udgave");
    cy.should("not.contain", "101. udgave");

    cy.get("[data-cy=dot_handler_dot_index_0]").should("exist").click();

    cy.contains("101. udgave");
    cy.should("not.contain", "102. udgave");
  });
});

describe("CoverCarousel", () => {
  it(`CoverCarousel`, () => {
    cy.visit(
      "/iframe.html?id=work-covercarousel--cover-carousel-multiple-covers"
    );

    // there should be additional text for specific edition
    cy.get("[data-cy=cover_carousel]")
      .should("exist")
      .find("img")
      .trigger("mouseover")
      .should("exist");

    cy.contains("manifestations[0].edition.edition");
    cy.should("not.contain", "manifestations[1].edition.edition");

    cy.get("[data-cy=left_arrow]").should("have.attr", "aria-hidden");
    cy.get("[data-cy=right_arrow]").should("exist").click();

    cy.contains("manifestations[1].edition.edition");
    cy.should("not.contain", "manifestations[0].edition.edition");

    cy.get("[data-cy=dot_handler_dot_index_0]").should("exist").click();

    cy.contains("manifestations[0].edition.edition");
    cy.should("not.contain", "manifestations[1].edition.edition");
  });
});

describe("Series", () => {
  before(function () {
    cy.visit(
      "/iframe.html?id=work-series--wrapped-series-slider&viewMode=story"
    );
  });

  it(`Verify title and creator are shown`, () => {
    cy.contains("I samme serie");
    // We sort away all non-books, so we only expect 3
    cy.get("a").should("have.length", 3);

    cy.get("a").eq(0).contains("Hugo i Sølvskoven: Begyndelsen");
    cy.get("a").eq(0).contains("Børge 'Linoleum' Skovgulv Gummigulv");

    cy.get("a")
      .eq(1)
      .contains(
        "Hugo i Sølvskoven 3½: Ritas mellemværende i Gulvskoven med Grullerne"
      );
    cy.get("a").eq(1).contains("Børge 'Linoleum' Skovgulv Gummigulv");

    cy.get("a").eq(2).contains("Lær at læse med Hugo og Rita 2");
    cy.get("a").eq(2).contains("Linoleum Gummigulv");

    cy.get("a")
      .eq(0)
      .should("have.attr", "href")
      .and(
        "contain",
        "/materiale/hugo-i-soelvskoven-begyndelsen_boerge-linoleum-skovgulv-gummigulv/some-work-id-1"
      );
  });
});

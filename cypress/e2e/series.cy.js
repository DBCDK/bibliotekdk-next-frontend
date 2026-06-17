describe("Series", () => {
  before(function () {
    cy.visit(
      "/iframe.html?id=work-series--wrapped-series-slider&viewMode=story"
    );
  });

  it(`Verify title and creator are shown`, () => {
    cy.contains("Gå til serien");

    // We have 4 members + 2 from the title name and "go to series" = 6
    cy.get(".row a").should("have.length", 6);

    cy.get(".row a").eq(0).contains("Sagaen om Sølvskoven");
    cy.get(".row a").eq(1).contains("Gå til serien");

    cy.get(".row a").eq(2).contains("Hugo i Sølvskoven: Begyndelsen");
    cy.get(".row a").eq(2).contains("Børge 'Linoleum' Skovgulv Gummigulv");

    cy.get(".row a")
      .eq(4)
      .contains(
        "Hugo i Sølvskoven 3½: Ritas mellemværende i Gulvskoven med Grullerne"
      );
    cy.get(".row a").eq(4).contains("Børge 'Linoleum' Skovgulv Gummigulv");

    cy.get(".row a").eq(5).contains("Lær at læse med Hugo og Rita 2");
    cy.get(".row a").eq(5).contains("Linoleum Gummigulv");

    cy.get(".row a")
      .eq(2)
      .should("have.attr", "href")
      .and(
        "contain",
        "/materiale/hugo-i-soelvskoven-begyndelsen_boerge-linoleum-skovgulv-gummigulv/some-work-id-1"
      );
  });
});

describe("Article", () => {
  it(`Section display article previews`, () => {
    cy.visit(
      "/iframe.html?id=articles-sections--triple-section&viewMode=story"
    );
    // Check that only articles matching section are shown
    cy.get("[data-cy=article-preview]").its("length").should("equal", 3);

    // Check order
    cy.get("[data-cy=article-preview]").eq(0).contains("Spørg en bibliotekar");
    cy.get("[data-cy=article-preview]").eq(1).contains("Bibliotek.dk");
    cy.get("[data-cy=article-preview]")
      .eq(2)
      .contains("Digitale bibliotekstilbud");
  });

  it(`Tab through article previews`, () => {
    cy.visit(
      "/iframe.html?id=articles-sections--triple-section&viewMode=story"
    );
    cy.get("[data-cy=article-preview]")
      .first()
      .contains("Spørg en bibliotekar")
      .parent()
      .tab()
      .contains("Bibliotek.dk")
      .parent()
      .tab()
      .contains("Digitale bibliotekstilbud");
  });

  it(`Article preview links to article page`, () => {
    cy.visit(
      "/iframe.html?id=articles-sections--triple-section&viewMode=story"
    );
    cy.get("[data-cy=article-preview]")
      .first()
      .should("exist")
      .tab()
      .should("exist")
      .tab()
      .click();

    // Check URL path is as expected
    cy.get("[data-cy=router-pathname]").should(
      "have.text",
      "/artikel/[title]/[articleId]"
    );

    // Check URL query parameters are as expected
    cy.get("[data-cy=router-query]").then((el) => {
      expect(JSON.parse(el.text())).to.deep.equal({
        title: "digitale-bibliotekstilbud",
        articleId: "1",
      });
    });
  });

  it(`Single-section: Can navigate to article`, () => {
    cy.visit(
      "/iframe.html?id=articles-sections--single-section&viewMode=story"
    );

    cy.get("[data-cy=button-læs-mere]").tab().click();

    // Check URL path is as expected
    cy.get("[data-cy=router-pathname]").should(
      "have.text",
      "/artikel/[title]/[articleId]"
    );

    // Check URL query parameters are as expected
    cy.get("[data-cy=router-query]").then((el) => {
      expect(JSON.parse(el.text())).to.deep.equal({
        title: "bibliotek-dk",
        articleId: "4",
      });
    });
  });

  it(`Single-section: Can navigate to alternative url`, () => {
    cy.visit(
      "/iframe.html?id=articles-sections--single-section-alternative-url"
    );

    cy.get("[data-cy=button-vejledninger-og-information]").click();

    // Check URL path is as expected
    cy.get("[data-cy=router-pathname]").should("have.text", "/artikler");
  });
});

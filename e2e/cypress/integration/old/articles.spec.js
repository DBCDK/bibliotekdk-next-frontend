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
    cy.tab();
    cy.focused().contains("Spørg en bibliotekar");
    cy.tab();
    cy.focused().contains("Bibliotek.dk");
    cy.tab();
    cy.focused().contains("Digitale bibliotekstilbud");
  });

  it(`Article preview links to article page`, () => {
    cy.visit(
      "/iframe.html?id=articles-sections--triple-section&viewMode=story"
    );
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.tabs(3)
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "/artikel/[title]/[articleId]?title=digitale-bibliotekstilbud&articleId=1"
        );
      });
  });

  it(`Single-section: Can navigate to article`, () => {
    cy.visit(
      "/iframe.html?id=articles-sections--single-section&viewMode=story"
    );
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.tab()
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          "/artikel/[title]/[articleId]?title=bibliotek.dk&articleId=4"
        );
      });
  });

  it(`Single-section: Can navigate to alternative url`, () => {
    cy.visit(
      "/iframe.html?id=articles-sections--single-section-alternative-url"
    );
    const stub = cy.stub();
    cy.on("window:alert", stub);
    cy.tab()
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith("/artikler");
      });
  });
});

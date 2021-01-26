describe("Article", () => {
  before(() => {
    cy.visit(
      "/iframe.html?id=articles--article-preview-section&viewMode=story"
    );
  });

  it(`Section display article previews`, () => {
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
    cy.tab();
    cy.focused().contains("Spørg en bibliotekar");
    cy.tab();
    cy.focused().contains("Bibliotek.dk");
    cy.tab();
    cy.focused().contains("Digitale bibliotekstilbud");
  });

  it(`Article preview links to article page`, () => {
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
});

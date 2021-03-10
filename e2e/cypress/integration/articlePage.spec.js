describe("ArticlePage", () => {
  before(() => {
    cy.visit("/iframe.html?id=articles-page--article-page&viewMode=story");
  });

  it(`Check if article has parsed body image`, () => {
    // check for onlye 1 figure
    cy.get("[data-cy=article-body]").find("figure").should("have.length", 1);
    // check img attributes
    cy.get("[data-cy=article-body]")
      .find("img")
      .invoke("attr", "src")
      .should("eq", "/img/bibdk-hero-scaled.jpeg");
    cy.get("[data-cy=article-body]")
      .find("img")
      .invoke("attr", "alt")
      .should("eq", "Læser bog i hængekøje");
    cy.get("[data-cy=article-body]")
      .find("img")
      .invoke("attr", "title")
      .should("eq", "Hængekøje hygge med bog");
    // check for onlye 1 figure caption
    cy.get("[data-cy=article-body]")
      .find("figcaption")
      .should("have.length", 1);
    // check for figure caption value match
    cy.get("[data-cy=article-body]")
      .find("figcaption")
      .contains("Hængekøje hygge med bog");
  });

  it("Print article", () => {
    cy.window().then((win) => {
      cy.stub(win, "print");
      cy.get("[data-cy=article-print]")
        .click()
        .then(() => {
          expect(win.print).to.be.calledOnce;
        });
    });
  });
});

describe("Inspiration", () => {
  describe("Slider", () => {
    it.skip(`Can fetch data in connected component`, () => {
      cy.visit("/iframe.html?id=inspiration-slider--connected");

      cy.get("[data-cy=inspiration-slider] [data-cy=work-card]").should(
        "have.length",
        3
      );

      cy.get("[data-cy=inspiration-slider] [data-cy=work-card]").each(
        (el, i) => {
          cy.get(el).click();
          cy.get("[data-cy=router-pathname]").should(
            "have.text",
            "/materiale/[title_author]/[workId]"
          );

          const idx = i + 1;

          cy.get("[data-cy=router-query]").should(
            "have.text",
            `{"title_author":"title-${idx}_creator-${idx}","workId":"workId-${idx}","type":"bog"}`
          );
        }
      );
    });
  });
});

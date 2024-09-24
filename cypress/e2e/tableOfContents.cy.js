describe("Table of Contents", () => {
  it(`Displays the table of contents for a work`, () => {
    cy.visit("/iframe.html?id=work-content--content-section&viewMode=story");
    cy.contains("Indhold");
    cy.contains("Kapitel 1");
    cy.contains("Kapitel 2");
    cy.contains("Kapitel 3");
    cy.contains("Kapitel 4");
  });

  it("Check wrapped content show list when there is a content", () => {
    cy.visit(
      "/iframe.html?id=work-content--content-wrapped-with-list-of-content&viewMode=story"
    );
    cy.contains("Indhold", { timeout: 10000 });
    cy.contains("Kapitel Alfabet");
    cy.contains("Kapitel Andre mennesker");
    cy.contains("Kapitel Ting og sager");
    cy.contains("Kapitel Dyr og skov");

    cy.should("not.contain", ";");
  });

  it("Check wrapped content show content when there is no listOfContent", () => {
    cy.visit(
      "/iframe.html?id=work-content--content-wrapped-no-list-of-content&viewMode=story"
    );
    cy.contains("Indhold", { timeout: 100000 });
    cy.contains("Kapitler ( ");
    cy.contains("Kapitel Alfabetet ;");
    cy.contains("Kapitel Andre mennesker ;");
    cy.contains("Kapitel Ting og sager ;");
    cy.contains("Kapitel Dyr og skov ;");
  });
});

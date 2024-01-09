describe("BookmarkOrder", () => {
  it(`Order a single material from bookmarklist`, () => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
      win.localStorage.clear();
    });
    cy.visit(
      "/iframe.html?id=modal-materials--materials-to-order-single-material"
    );

    // order modal should open when there is one material only that can be ordered
    cy.get("[data-cy=button-godkend]").should("exist").click();
    // order successfully
    cy.contains("Bestillingen blev gennemført");

    cy.window().then((win) => {
      console.log(win.sessionStorage, "SESSIONSTORAGE");
      console.log(win.localStorage, "LOCALSTORAGE");
    });

    // when ordered again user should confirm
    cy.get("[data-cy=multiorder-button-close]").should("exist").click();

    cy.wait(500);
    cy.get("[data-cy=multiorder-next-button]").should("exist").click();
  });
});

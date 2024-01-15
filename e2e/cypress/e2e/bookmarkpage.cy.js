describe("Bookmark page", () => {
  it(`test book marks`, () => {
    cy.visit("/iframe.html?id=profile-bookmarks--bookmark-list");

    cy.get("article").should("exist").should("have.length", 2);

    // check box list has none selected
    cy.get("article").each(($item) => {
      // $item is a wrapped jQuery element
      cy.wrap($item).should("have.attr", "aria-checked", "false");
    });

    //order button is also disabled when none selected
    cy.get("[data-cy=button-bestil]")
      .should("exist")
      .should("have.attr", "disabled");
    // select all
    cy.get("#bookmarkpage-select-all").should("exist").click({ force: true });

    // all elements in checkbox list is selected
    cy.get("article").each(($item) => {
      cy.wrap($item).should("have.attr", "aria-checked", "true");
    });
    cy.get("[data-cy=button-bestil]")
      .should("exist")
      .should("not.have.attr", "disabled");

    // remove an element from list
    cy.get("article").first().should("exist").click();
    cy.get("[data-cy=bookmarks-remove-from-list]").should("exist").click();
    cy.get("article").should("exist").should("have.length", 1);
  });

  it(`test delete all`, () => {
    cy.visit("/iframe.html?id=profile-bookmarks--bookmark-list");
    // remove ALL elements from list - verify that select all is disabled
    cy.get("article").should("exist").should("have.length", 2);

    cy.get("#bookmarkpage-select-all").should("exist").click({ force: true });
    cy.get("[data-cy=bookmarks-remove-from-list]").should("exist").click();
    cy.get("[data-cy=bookmarks-select-all-checkbox]")
      .should("exist")
      .should("have.attr", "aria-checked", "false");
  });
});

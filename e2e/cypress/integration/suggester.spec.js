/**
 * @file
 * Test functionality of Header
 */
describe("Suggester", () => {
  before(function () {
    cy.visit("/iframe.html?id=search-suggester--header-suggester");
  });

  // Tabs
  it(`Show container + container suggestions on user type`, () => {
    // container get visible when user types.
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    // 3 obj. in the data array
    cy.get("[data-cy=suggester-container] ul li").should("have.length", 3);

    // All 3 types of list items should be visible
    cy.get("[data-cy=suggester-work-element]").should("be.visible");
    cy.get("[data-cy=suggester-creator-element]").should("be.visible");
    cy.get("[data-cy=suggester-subject-element]").should("be.visible");
  });

  it(`Can use arrows to navigate thrue suggestions`, () => {
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    // Arrow navigation
    cy.get("[data-cy=suggester-input]")
      .type("{downarrow}")
      .type("{downarrow}")
      .type("{downarrow}");

    cy.get("[data-cy=suggester-creator-element]")
      .parent()
      .should("have.attr", "aria-selected", "true");
  });

  it(`Can select suggestion on 'Enter' click`, () => {
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    // Arrow navigation
    cy.get("[data-cy=suggester-input]").type("{downarrow}").type("{enter}");

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Ternet Ninja selected`);
    });
  });

  it(`Can select suggestion on 'tab' click`, () => {
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-input]")
      .type("{downarrow}")
      .type("{downarrow}")
      .tab();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`ninjaer selected`);
    });
  });

  it(`Desktop: Can select suggestion on 'mouse' click`, () => {
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-creator-element]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Anders Matthesen selected`);
    });
  });

  it(`Mobile: Can select suggestion on 'mouse' click`, () => {
    cy.viewport(411, 731);

    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("a");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-creator-element]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Anders Matthesen selected`);
    });
  });

  it(`Mobile: Should have search history on mobile version of suggester`, () => {
    cy.viewport(411, 731);
    cy.get("[data-cy=button-mobile]").click();
    cy.get("[data-cy=suggester-input]").clear();

    // Check for 2 history elements
    cy.get("[data-cy=suggester-container] ul li").should("have.length", 2);
  });

  it(`Mobile: Clear history on mobile version of suggester`, () => {
    cy.viewport(411, 731);

    cy.get("[data-cy=suggester-clear-history]").should("be.visible");
    cy.get("[data-cy=suggester-clear-history]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`History cleared`);
    });
  });
});

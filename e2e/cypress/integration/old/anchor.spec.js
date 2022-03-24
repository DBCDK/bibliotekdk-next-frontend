describe("Anchor menu", () => {
  it(`Should render 5 sections`, () => {
    cy.visit("/iframe.html?id=base-anchor--default");

    cy.get("[data-cy=anchor-section]").should("have.length", 5);
  });

  it(`Should render 5 menu items`, () => {
    cy.visit("/iframe.html?id=base-anchor--default");

    cy.get("[data-cy=anchor-menu-item]").should("have.length", 5);
  });

  it(`Should navigato to clicked section (Section 4)`, () => {
    cy.visit("/iframe.html?id=base-anchor--default");

    cy.get("[data-cy=anchor-menu-item]").eq(3).click();
    cy.get("[data-cy=anchor-menu-item]").eq(3).contains("Section4");
    cy.get("[data-cy=anchor-menu-item]").eq(3).should("have.class", "active");
    cy.get("[data-cy=anchor-section]").eq(3).should("be.visible");
    cy.get("[data-cy=anchor-section]").eq(3).contains("Section 4");
  });

  it(`Should navigato to clicked section (Section 2)`, () => {
    cy.visit("/iframe.html?id=base-anchor--default");

    cy.get("[data-cy=anchor-menu-item]").eq(1).click();
    cy.get("[data-cy=anchor-menu-item]").eq(1).contains("Section2");
    cy.get("[data-cy=anchor-menu-item]").eq(1).should("have.class", "active");
    cy.get("[data-cy=anchor-section]").eq(1).should("be.visible");
    cy.get("[data-cy=anchor-section]").eq(1).contains("Section 2");
  });

  it(`Should chnage active element on scroll`, () => {
    cy.visit("/iframe.html?id=base-anchor--default");

    cy.get("[data-cy=anchor-menu-item]").each(($el, idx) => {
      cy.get("[data-cy=anchor-section]").eq(idx).scrollIntoView();
      cy.get("[data-cy=anchor-menu-item]")
        .eq(idx)
        .should("have.class", "active");
    });
  });

  it(`Menu gets sticky on the fly`, () => {
    cy.visit("/iframe.html?id=base-anchor--sections-above-menu");
    cy.get("[data-cy=anchor-menu-items]").should("not.have.class", "sticky");
    cy.get("[data-cy=anchor-section]").eq(2).scrollIntoView();
    cy.get("[data-cy=anchor-menu-items]")
      .should("have.class", "sticky")
      .should("have.css", "position", `fixed`);
  });

  it(`Menu gets relative on the fly`, () => {
    cy.visit("/iframe.html?id=base-anchor--sections-above-menu");
    cy.get("[data-cy=anchor-section]").eq(0).scrollIntoView();
    cy.get("[data-cy=anchor-menu-items]")
      .should("not.have.class", "sticky")
      .should("not.have.css", "position", `fixed`);
  });
});

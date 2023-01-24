/**
 * @file
 * Test functionality of Header
 */

describe("Accordion", () => {
  beforeEach(function () {
    cy.visit("/iframe.html?id=base-accordion--default");
  });

  it(`All 5 items in accorion is visible`, () => {
    cy.get("[data-cy=accordion]")
      .find("[data-cy=accordion-item]")
      .should("have.length", 5);
  });

  it(`All 5 items should have visible expand icons`, () => {
    cy.get("[data-cy=accordion]")
      .find("[data-cy=expand-icon]")
      .should("have.length", 5);
  });

  it(`Can expand and close sections`, () => {
    cy.get("[data-cy=accordion-item]").first().click();

    cy.get("[data-cy=accordion-item]")
      .first()
      .find(".collapse")
      .should("have.class", "show");

    cy.get("[data-cy=accordion-item]").eq(1).click();

    cy.get("[data-cy=accordion-item]")
      .eq(1)
      .find(".collapse")
      .should("have.class", "show");

    cy.get("[data-cy=accordion-item]")
      .first()
      .find(".collapse")
      .should("not.have.class", "show");

    cy.get("[data-cy=accordion-item]").eq(1).click("top");

    cy.get("[data-cy=accordion-item]")
      .eq(1)
      .find(".collapse")
      .should("not.have.class", "show");
  });

  it(`Expand icon changes on click`, () => {
    cy.get("[data-cy=accordion-item]").first().click();

    cy.get("[data-cy=accordion-item]")
      .first()
      .find(".collapse")
      .should("have.class", "show");

    cy.get("[data-cy=accordion-item]")
      .first()
      .find("[data-cy=expand-icon]")
      .find("span")
      .should("have.length", 2);

    cy.get("[data-cy=accordion-item]")
      .first()
      .find("[data-cy=expand-icon] span:first-child")
      .should("have.css", "opacity", "0");

    cy.get("[data-cy=accordion-item]")
      .first()
      .find("[data-cy=expand-icon] span:last-child")
      .should("be.visible");
  });

  it(`Can tab through sections`, () => {
    cy.get("[data-cy=accordion-item]").first().tabs(5).type("{enter}");

    cy.get("[data-cy=accordion-item]")
      .last()
      .find(".collapse")
      .should("have.class", "show");
  });
});

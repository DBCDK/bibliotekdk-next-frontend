/**
 * @file
 * Test functionality of Text
 */
describe("Overview", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-overview--work-overview");
  });

  // Tabs
  it(`Can tab through path`, () => {
    cy.get("body").tab();

    cy.focused().parent().should("have.attr", "data-cy", "crumb-bøger");

    cy.tabs(3);

    cy.focused().parent().should("have.attr", "data-cy", "crumb-roman");
  });

  it(`Can tab to bookmark button`, () => {
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "bookmark-klodernes-kamp");
  });

  it(`Can tab to material selection`, () => {
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "tag-bog");

    cy.tabs(6);
    cy.focused().should("have.attr", "data-cy", "tag-punktskrift");
  });

  it(`Can tab to 'add-to-basket' button`, () => {
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "button-læg-i-lånekurv");
  });

  // Clicks
  it(`Can click on bookmark button`, () => {
    cy.get(`[data-cy=bookmark-klodernes-kamp]`).click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Bookmarked!`);
    });
  });

  it(`Can click on 'add-to-basket' button`, () => {
    cy.get(`[data-cy=button-læg-i-lånekurv]`).click();
    cy.focused().should("have.attr", "data-cy", "button-læg-i-lånekurv");
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Button clicked!`);
    });
  });

  it(`Can click on button tag`, () => {
    const tag = "tag-ebog";
    const tag2 = "tag-bog";

    cy.get(`[data-cy=${tag}]`).children("i").should("not.be.visible");
    cy.get(`[data-cy=${tag}]`).click();
    cy.get(`[data-cy=${tag}]`).children("i").should("be.visible");
    cy.get(`[data-cy=${tag2}]`).children("i").should("not.be.visible");
  });
});

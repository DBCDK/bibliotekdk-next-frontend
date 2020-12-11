/**
 * @file
 * Test functionality of Header
 */
describe("Header", () => {
  before(function () {
    cy.visit("/iframe.html?id=header--nav-header");
  });

  // Tabs
  it(`Can tab through all clickable elements`, () => {
    cy.viewport(1920, 1080);

    // logo
    cy.get("body").tab();
    cy.focused().should("have.attr", "data-cy", "header-logo");

    // first element in section
    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "header-link-books");

    // last element in section
    cy.tabs(6);
    cy.focused().should("have.attr", "data-cy", "header-link-nodes");

    // first element in section
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "header-link-digitaloffers");
    // last element in section
    cy.tabs(2);
    cy.focused().should("have.attr", "data-cy", "header-link-becomeloaner");

    // first element in section
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "suggester-input");
    // last element in section
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "header-searchbutton");

    // first element in section
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "header-link-login");
    // last element in section
    cy.tabs(2);
    cy.focused().should("have.attr", "data-cy", "header-link-menu");
  });

  // Screen size
  it(`Check visible elemets for screensizes > 1400`, () => {
    cy.viewport(1920, 1080);
    cy.get("[data-cy=header-materials]").should("be.visible");
    cy.get("[data-cy=header-top-actions]").should("be.visible");
    cy.get("[data-cy=header-bottom-actions]").should("be.visible");
    cy.get("[data-cy=header-search]").should("be.visible");
  });

  // Screen size
  it(`Check visible elemets for screensizes < 1400`, () => {
    cy.viewport(1399, 1080);

    cy.get("[data-cy=header-materials]").should("be.visible");
    cy.get("[data-cy=header-top-actions]").should("not.be.visible");
    cy.get("[data-cy=header-bottom-actions]").should("be.visible");
    cy.get("[data-cy=header-search]").should("be.visible");
  });

  it(`Check visible elemets for screensizes < 1200`, () => {
    cy.viewport(1199, 1080);

    cy.get("[data-cy=header-materials]").should("be.visible");
    cy.get("[data-cy=header-top-actions]").should("not.be.visible");

    cy.get("[data-cy=header-link-menu]").should("be.visible");
    cy.get("[data-cy=header-link-login]").should("not.be.visible");
    cy.get("[data-cy=header-link-basket]").should("not.be.visible");

    cy.get("[data-cy=header-search]").should("be.visible");
  });

  it(`Check visible elemets for screensizes < 992`, () => {
    cy.viewport(991, 700);

    cy.get("[data-cy=header-materials]").should("not.be.visible");
    cy.get("[data-cy=header-top-actions]").should("not.be.visible");
    cy.get("[data-cy=header-search]").should("be.visible");

    cy.get("[data-cy=suggester-input]").should("not.be.visible");
    cy.get("[data-cy=header-searchbutton]").should("not.be.visible");

    cy.get("[data-cy=header-link-menu]").should("be.visible");
    cy.get("[data-cy=header-link-login]").should("be.visible");
    cy.get("[data-cy=header-link-basket]").should("be.visible");
    cy.get("[data-cy=header-link-search]").should("be.visible");
  });

  // Suggester
  it(`Can submit suggester form from header`, () => {
    // container get visible when user types.
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("Anders Morgenthaler");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=header-searchbutton]").click();

    // When running in Storybook mode, clicking a link
    // will open an alert. We create a stub that record calls to alert.
    // const stub = cy.stub();
    // cy.on("window:alert", stub);

    // cy.get("[data-cy=header-searchbutton]")
    //   .click()
    //   .then(() => {
    //     const expected = "/findq=Anders%20Morgenthaler";
    //     expect(stub.getCall(0)).to.be.calledWith(expected);
    //   });

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`/find?q=Anders Morgenthaler`);
    });
  });
});

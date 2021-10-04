/**
 * @file
 * Test functionality of Header
 */
describe("Header", () => {
  before(function () {
    cy.visit("/iframe.html?id=layout-header--nav-header");
  });

  // BETA-1 ... basket gone .. links disabled -> taborder fucked up ..  skip this test
  // @TODO enable this test
  it(`Can tab through all clickable elements`, () => {
    cy.viewport(1920, 1080);

    // logo
    cy.get("body").tab();
    cy.focused().should("have.attr", "data-cy", "key-logo");

    // first element in section
    // BETA-1 outcommented
    cy.tabs(2);
    cy.focused().should("have.attr", "data-cy", "header-link-books");

    // last element in section
    cy.tabs(4);
    cy.focused().should("have.attr", "data-cy", "header-link-music");

    // first element in section
    cy.tabs(2);
    cy.focused().should("have.attr", "data-cy", "header-link-digitaloffers");
    // last element in section
    cy.tabs(2);
    cy.focused().should("have.attr", "data-cy", "header-link-becomeloaner");

    // materialselector
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "header-material-selector");
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
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "header-link-menu");
  });

  it("check url on top action elements", () => {
    // top actions only visible on BIG viewport
    cy.viewport(1920, 1080);
    cy.get("[data-cy=header-link-asklibrarian")
      .should("have.attr", "href")
      .should("not.be.empty")
      .and("contain", "/artikel/spoerg-en-bibliotekar/7");
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
    cy.get("[data-cy=header-link-login]").should("be.visible");
    // BETA-1 .. basket is gone
    // @TODO enable this test
    //cy.get("[data-cy=header-link-basket]").should("be.visible");

    cy.get("[data-cy=header-search]").should("be.visible");
  });

  it(`Check visible elemets for screensizes < 992`, () => {
    cy.viewport(990, 700);
    cy.get("[data-cy=header-material-selector]").should("not.be.visible");

    cy.get("[data-cy=header-materials]").should("not.be.visible");
    cy.get("[data-cy=header-top-actions]").should("not.be.visible");
    cy.get("[data-cy=header-search]").should("be.visible");

    cy.get("[data-cy=suggester-input]").should("not.be.visible");
    cy.get("[data-cy=header-searchbutton]").should("not.be.visible");

    cy.get("[data-cy=header-link-menu]").should("be.visible");
    cy.get("[data-cy=header-link-login]").should("be.visible");
    // BETA-1 .. basket is gone
    // @TODO enable this test
    //cy.get("[data-cy=header-link-basket]").should("be.visible");
    cy.get("[data-cy=header-link-search]").should("be.visible");
  });

  // Suggester
  it(`Can submit suggester form from header`, () => {
    cy.fixture("suggestions_morgenthaler.json").then((fixture) => {
      cy.intercept("POST", "/graphql", (req) => {
        if (req?.body?.query?.includes("suggest")) {
          req.reply(fixture);
        }
      });
    });

    // container get visible when user types.
    cy.get("[data-cy=suggester-input]").focus();
    cy.get("[data-cy=suggester-input]").type("peter ");
    cy.get("[data-cy=suggester-container]").should("be.visible");

    cy.get("[data-cy=suggester-input]").clear();
    cy.get("[data-cy=suggester-input]").type("Anders Morgenthaler");
    cy.get("[data-cy=header-searchbutton]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`/find?q=Anders Morgenthaler`);
    });
  });

  it(`Mobile: remove focus and empty field on input search`, () => {
    cy.visit("/iframe.html?id=layout-header--nav-header");
    cy.viewport(411, 731);

    cy.get("[data-cy=header-link-search]").click();
    cy.get("[data-cy=suggester-input]").type("matthesen");
    cy.get("[data-cy=suggester-input]").type("{enter}");
    cy.on("window:alert", (str) => {
      expect(str).to.equal(`/find?q=matthesen`);
    });
    cy.get("[data-cy=suggester-input]").should(
      "not.have.class",
      "react-autosuggest__input--focused"
    );
    cy.get("[data-cy=suggester-input]").should("have.value", "");
  });

  it(`Mobile: remove focus and empty field on "arrow/close" suggester click`, () => {
    cy.viewport(411, 731);

    cy.get("[data-cy=header-link-search]").click();
    cy.get("[data-cy=suggester-input]").type("hest");
    cy.get("[data-cy=suggester-arrow-close]").click();
    cy.get("[data-cy=suggester-input]").should(
      "not.have.class",
      "react-autosuggest__input--focused"
    );
    cy.get("[data-cy=suggester-input]").should("have.value", "");
  });

  it(`Should show log in button when logged out`, () => {
    cy.viewport(1920, 1080);
    cy.get("[data-cy=text-log-ind]").should("have.text", "Log ind");
  });

  it(`Should show log out button when logged in`, () => {
    cy.visit("/iframe.html?id=layout-header--nav-header-user-logged-in");
    cy.viewport(1920, 1080);
    cy.get("[data-cy=text-log-ud]").should("have.text", "Log ud");
  });
});

/**
 * @file
 * Test functionality of Text
 */
describe("Overview", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-overview--work-overview");
  });

  // Tabs BETA-1 removed breadcrumbs - tab order fucked up skip this test
  // @ TODO enable
  it.skip(`Can tab through path`, () => {
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
    cy.tabs(2);
    cy.focused().should("have.attr", "data-cy", "tag-bog");

    cy.tabs(6);
    cy.focused().should("have.attr", "data-cy", "tag-punktskrift");
  });

  it(`Can tab to 'add-to-basket' button`, () => {
    cy.tab();
    cy.focused().should("have.attr", "data-cy");
  });

  // Clicks
  it(`Can click on bookmark button`, () => {
    cy.get(`[data-cy=bookmark-klodernes-kamp]`).click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Bookmarked!`);
    });
  });

  it.skip(`Can click on 'add-to-basket' button`, () => {
    cy.get(`[data-cy=button-order-overview]`).click();
    cy.focused().should("have.attr", "data-cy", "button-order-overview");
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

  it(`Can access external ebook`, () => {
    cy.get(`[data-cy=tag-ebog]`).click();
    cy.get("[data-cy=button-gå-til-bogen]").contains("Gå til bogen");
    cy.get("[data-cy=button-gå-til-bogen]").click();
    cy.contains("Du bliver sendt til ebookurl.dk");
    cy.on("window:alert", (str) => {
      expect(str).to.equal("https://ebookurl.dk");
    });
  });

  it(`Can access external audio book`, () => {
    cy.get(`[data-cy="tag-lydbog-(net)"]`).click();
    cy.get("[data-cy=button-gå-til-bogen]").contains("Gå til bogen");
    cy.get("[data-cy=button-gå-til-bogen]").click();
    cy.contains("Du bliver sendt til audiobookurl.dk");
    cy.on("window:alert", (str) => {
      expect(str).to.equal("https://audiobookurl.dk");
    });
  });

  it(`Shows button skeleton when it has not been determined if material is physical or online`, () => {
    // Punkskrift material has onlineAccess undefined.
    // I.e. work details have not been fetched yet.
    // Othwerwise it is null or an array
    cy.get(`[data-cy=tag-punktskrift]`).click();
    cy.get("[data-cy=button-order-overview]").should("be.disabled");
  });
});

/**
 * @file
 * Test functionality of Text
 */
describe("Overview", () => {
  describe("Overview parent", () => {
    beforeEach(function () {
      cy.visit("/iframe.html?id=work-overview--overview-wrapped");
    });

    it(`Can tab through to different elements`, () => {
      // Material Selection
      cy.get("[data-cy=tag-bog]")
        .focus()
        .should("have.attr", "data-cy", "tag-bog")
        .should("contain", "Bog")
        .tabs(1)
        .should("have.attr", "data-cy", "tag-ebog")
        .tabs(1)
        .should("have.attr", "data-cy", "tag-tidsskrift")
        .tabs(1)
        .should("have.attr", "data-cy", "tag-tidsskriftsartikel");

      // Creators and bookmark
      cy.get(`[data-cy=title-overview]`).contains("Hugo i Sølvskoven");
      cy.get("[data-cy=tag-bog]")
        .focus()
        .should("have.attr", "data-cy", "tag-bog")
        .tabs(4)
        .should("have.attr", "data-cy", "button-order-overview-enabled");
    });

    // Clicks
    it(`Can click on bookmark button`, () => {
      cy.get(`[data-cy=bookmark-button]`).should("be.visible").focus().click();

      cy.on("window:alert", (str) => {
        expect(str).to.equal(`Bookmarked!`);
      });
    });

    it(`Can click on button tag`, () => {
      const tagEbog = "tag-ebog";
      const tagBog = "tag-bog";

      cy.get(`[data-cy=${tagEbog}]`).children("i").should("not.be.visible");
      cy.get(`[data-cy=${tagEbog}]`).focus().contains("Ebog").click();
      cy.get(`[data-cy=${tagEbog}]`).children("i").should("be.visible");
      cy.get(`[data-cy=${tagBog}]`).children("i").should("not.be.visible");
    });

    it("Can default its first materialType: ", () => {
      cy.visit("/iframe.html?id=work-overview--overview-wrapped-no-type");

      cy.get("[data-cy=icon-Bog]")
        .children()
        .should("have.attr", "src", "/icons/checkmark.svg")
        .should("have.attr", "alt", "ikke valgt");

      cy.on("url:change", (url) => {
        expect(url).to.contain("type=Bog");
      });

      cy.get("[data-cy=button-order-overview-enabled]").should("exist");

      cy.get(`[data-cy=icon-Bog]`, { timeout: 500 })
        .children()
        .should("have.attr", "src", "/icons/checkmark.svg");

      cy.get("[data-cy=icon-Ebog]", { timeout: 500 })
        .children()
        .should("have.attr", "src", "/icons/checkmark.svg")
        .should("have.attr", "alt", "ikke valgt");
    });

    // Tabs BETA-1 removed breadcrumbs - tab order fucked up skip this test
    // @ TODO Remove below
    // TODO: remove because should be tested reservationbutton.spec.js
    it.skip(`Can click on 'add-to-basket' button`, () => {
      cy.get(`[data-cy=button-order-overview]`).click();
      cy.focused().should("have.attr", "data-cy", "button-order-overview");
      cy.on("window:alert", (str) => {
        expect(str).to.equal(`Button clicked!`);
      });
    });

    // TODO: remove because should be tested reservationbutton.spec.js
    it.skip(`Can access external ebook`, () => {
      cy.get(`[data-cy=tag-ebog]`).contains("Ebog").click();
      cy.get("[data-cy=button-gå-til-bogen]").contains("Gå til bogen").click();
      cy.contains("Du bliver sendt til ebookurl.dk");
      cy.on("window:alert", (str) => {
        expect(str).to.equal("https://ebookurl.dk");
      });
    });

    // TODO: remove because should be tested reservationbutton.spec.js
    it.skip(`Can access external audio book`, () => {
      cy.get(`[data-cy="tag-lydbog-(net)"]`).contains("Lydbog (net)").click();
      cy.get("[data-cy=button-gå-til-bogen]").contains("Gå til bogen");
      cy.get("[data-cy=button-gå-til-bogen]").click();
      cy.contains("Du bliver sendt til audiobookurl.dk");
      cy.on("window:alert", (str) => {
        expect(str).to.equal("https://audiobookurl.dk");
      });
    });

    // TODO: remove because should be tested reservationbutton.spec.js
    it.skip(`Shows button skeleton when it has not been determined if material is physical or online`, () => {
      // Punkskrift material has onlineAccess undefined.
      // I.e. work details have not been fetched yet.
      // Othwerwise it is null or an array
      cy.get(`[data-cy=tag-punktskrift]`).contains("Punktskrift").click();
      cy.get("[data-cy=button-order-overview]").should("be.disabled");
    });
  });

  describe("LocalizationsLink", () => {
    beforeEach(function () {
      cy.wrap("[data-cy=text-nolocalizations]").as("nolocalizations");
      cy.wrap("[data-cy=link-localizations]").as("localizations");
      cy.wrap("[data-cy=skeleton").as("skeleton");
    });

    it("Preferred online", function () {
      cy.visit(
        "/iframe.html?id=work-overview-localizationslink--localizations-link-preferred-online"
      );

      cy.get(`${this.nolocalizations}`).should("not.exist");
      cy.get(`${this.localizations}`).should("not.exist");
      cy.get(`${this.skeleton}`).should("not.exist");
    });
    it("Not available for loan at any library", function () {
      cy.visit(
        "/iframe.html?id=work-overview-localizationslink--localizations-link-no-available"
      );

      cy.get(`${this.nolocalizations}`).should("exist");
      cy.get(`${this.localizations}`).should("not.exist");
      cy.get(`${this.skeleton}`).should("not.exist");
    });
    it("Available at libraries", function () {
      cy.visit(
        "/iframe.html?id=work-overview-localizationslink--localizations-link-available-at-libraries"
      );

      cy.get(`${this.nolocalizations}`).should("not.exist");
      cy.get(`${this.localizations}`).should("exist");
      cy.get(`${this.skeleton}`).should("not.exist");
    });
    it("Slow loading", function () {
      cy.visit(
        "/iframe.html?id=work-overview-localizationslink--localizations-link-slow-response"
      );

      cy.get(`${this.nolocalizations}`).should("not.exist");
      cy.get(`${this.localizations}`).should("not.exist");
      cy.get(`${this.skeleton}`).should("exist");
    });
  });

  describe("Alternative Options", () => {
    beforeEach(function () {
      cy.wrap("[data-cy=link]").as("link");
      cy.wrap("[data-cy=skeleton").as("skeleton");
    });

    it("No alternatives", function () {
      cy.visit(
        "/iframe.html?id=work-overview-alternatives--alternative-options-no-alternatives"
      );

      cy.get(`${this.link}`).should("not.exist");
      cy.get(`${this.skeleton}`).should("not.exist");
    });
    it("With alternatives", function () {
      cy.visit(
        "/iframe.html?id=work-overview-alternatives--alternative-options-with-alternatives"
      );

      cy.get(`${this.link}`).should("exist");
      cy.get(`${this.skeleton}`).should("not.exist");
    });
    it("Slow loading", function () {
      cy.visit(
        "/iframe.html?id=work-overview-alternatives--alternative-options-slow-response"
      );

      cy.get(`${this.link}`).should("not.exist");
      cy.get(`${this.skeleton}`).should("exist");
    });
  });
});

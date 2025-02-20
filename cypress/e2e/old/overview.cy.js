/**
 * @file
 * Test functionality of Text
 */
describe("Overview", () => {
  describe("Overview parent", () => {
    beforeEach(function () {
      cy.visit("/iframe.html?id=work-overview--overview-wrapped");
    });

    //test bookmark dropdown 
    it.only("Can click on BookmarkDropdown and select a value", () => {
      cy.wait(500);

      //open bookmarkDropdown
      cy.get(`[data-cy=bookmark-button]`).click();
    
      //check that dropdown options are visible
      cy.get("[data-cy^='bookmark-']").should("be.visible");

      //verify that e-book is not selected
      cy.get("[data-cy='bookmark-E-bog-1']")
      .should("exist")
      .should("have.attr", "data-selected", "false"); 

      //click on e-book
      cy.get("[data-cy='bookmark-E-bog-1']").click();
     
      //verify that e-book is selected
     cy.get("[data-cy='bookmark-E-bog-1']")
     .should("exist")
     .should("have.attr", "data-selected", "true"); 
    

    });

    
    it(`have basic functionining functionality`, () => {
      cy.contains("Overview - bog", { timeout: 15000 });

      // --- Can tab through to different elements
      // Material Selection
      cy.get("[data-cy=tag-bog]", { timeout: 10000 })
        .focus()
        .should("have.attr", "data-cy", "tag-bog")
        .should("contain", "Bog")
        .tabs(1)
        .should("have.attr", "data-cy", "tag-e-bog")
        .tabs(1)
        .should("have.attr", "data-cy", "tag-artikel")
        .tabs(1)
        .should("have.attr", "data-cy", "tag-tidsskrift");

      // Creators and bookmark
      cy.get(`[data-cy=title-overview]`).contains("Hugo i Sølvskoven");
      cy.get("[data-cy=tag-bog]")
        .focus()
        .should("have.attr", "data-cy", "tag-bog")
        .tabs(4)
        .should("have.attr", "data-cy", "button-order-overview-enabled");

      // Bookmarks
      cy.get(`[data-cy=bookmark-button]`).should("be.visible").focus().click();

      cy.on("window:alert", (str) => {
        expect(str).to.equal(`Bookmarked!`);
      });

      // Can click on button tag
      const tagEbog = "tag-e-bog";
      const tagBog = "tag-bog";

      cy.get(`[data-cy=${tagEbog}]`).children("i").should("not.be.visible");
      cy.get(`[data-cy=${tagEbog}]`).focus().contains("E-bog").click();
      cy.get(`[data-cy=${tagEbog}]`).children("i").should("be.visible");
      cy.get(`[data-cy=${tagBog}]`).children("i").should("not.be.visible");
    });

    it("Can default its first materialType: ", () => {
      cy.visit("/iframe.html?id=work-overview--overview-wrapped-no-type");
      cy.contains("Overview -", { timeout: 15000 });

      cy.get("[data-cy=icon-Bog]")
        .children()
        .should("have.attr", "src", "/icons/checkmark.svg");

      cy.on("url:change", (url) => {
        expect(url).to.contain("type=Bog");
      });

      cy.get("[data-cy=button-order-overview-enabled]", {
        timeout: 10000,
      }).should("exist");

      cy.get(`[data-cy=icon-Bog]`)
        .children()
        .should("have.attr", "src", "/icons/checkmark.svg")
        .should("have.attr", "alt", "valgt");

      cy.get("[data-cy=icon-E-bog]")
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
      cy.get(`[data-cy=tag-e-bog]`).contains("E-bog").click();
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
    it("is visible when material is physical, even though ILL is not supported", () => {
      cy.visit(
        "/iframe.html?args=&id=work-overview-localizationslink--localizations-link-no-ill-but-available-at-libraries"
      );
      cy.contains("Findes på 1 bibliotek ");
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

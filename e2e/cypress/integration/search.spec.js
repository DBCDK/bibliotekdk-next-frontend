const { csrfToken } = require("next-auth/client");

describe("Search", () => {
  context(`Form`, () => {
    it(`Maps query parameters from url to input fields`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "some all",
          "q.title": "some title",
          "q.creator": "some creator",
          "q.subject": "some subject",
          workType: "movie",
        });
      });

      // Check URL path is as expected
      cy.get("[data-cy=router-pathname]").should("have.text", "/find");

      // And check that they are correctly displayed
      cy.get("[data-cy=header-material-selector]").contains("Film");
      cy.get("[data-cy=suggester-input]").should("have.value", "some all");
      cy.get("[data-cy=search-input-title]").should("have.value", "some title");
      cy.get("[data-cy=search-input-creator]").should(
        "have.value",
        "some creator"
      );
      cy.get("[data-cy=search-input-subject]").should(
        "have.value",
        "some subject"
      );
    });

    it(`Maps query parameters from input fields to url to input fields`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header");

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({});
      });

      // Expand search possibilities
      cy.contains("Flere søgemuligheder").click();

      // And fill in some stuff
      cy.get("[data-cy=header-material-selector]").click();
      cy.get("[data-cy=item-movie] > [data-cy=text-film]").click();
      cy.get("[data-cy=suggester-input]").type("some all");
      cy.get("[data-cy=search-input-title]").type("some title");
      cy.get("[data-cy=search-input-creator]").type("some creator");
      cy.get("[data-cy=search-input-subject]").type("some subject");
      cy.get("[data-cy=header-searchbutton]").click();

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "some all",
          "q.title": "some title",
          "q.creator": "some creator",
          "q.subject": "some subject",
          workType: "movie",
        });
      });
      cy.get("[data-cy=router-pathname]").should("have.text", "/find");
      cy.get("[data-cy=router-action]").should("have.text", "push");
    });

    it(`Click input clear button should be reflected in URL immediately`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");

      cy.get("[data-cy=search-input-subject-clear]").click();

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "some all",
          "q.title": "some title",
          "q.creator": "some creator",
          workType: "movie",
        });
      });
    });

    it(`Editing default search input, should not wipe other input`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");

      cy.get("[data-cy=suggester-input]").clear().type("something else");

      cy.get("[data-cy=header-searchbutton]").click();

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "something else",
          "q.title": "some title",
          "q.creator": "some creator",
          "q.subject": "some subject",
          workType: "movie",
        });
      });
    });

    it(`All default input suggestions will search with q.all`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header");

      cy.get("[data-cy=suggester-input]").clear().type("hest");

      cy.get("[data-cy=suggester-container")
        .find("li")
        .should("have.length", 3);

      // Check creator, subject, and work
      [
        "suggest.result[0].name",
        "suggest.result[1].value",
        "suggest.result[2].title",
      ].forEach((suggestion) => {
        cy.get("[data-cy=suggester-input]").clear().type("hest");
        cy.contains(suggestion).click();
        cy.get("[data-cy=router-query]").then((el) => {
          expect(JSON.parse(el.text())).to.deep.equal({
            "q.all": suggestion,
          });
        });
      });
    });

    it(`Tab away from input will not sync with URL immediately`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header");

      cy.get("[data-cy=suggester-input]").clear().type("hest");
      cy.tab();

      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({});
      });
    });

    it(`Pressing enter will sync with URL immediately`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header");

      cy.get("[data-cy=suggester-input]").clear().type("hest{enter}");

      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({ "q.all": "hest" });
      });
    });
  });
});

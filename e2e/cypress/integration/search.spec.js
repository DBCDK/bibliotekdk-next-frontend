describe("Search", () => {
  describe(`Form`, () => {
    it(`Maps query parameters from url to input fields`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "some all",
          "q.title": "some title",
          "q.creator": "some creator",
          "q.subject": "some subject",
          workTypes: "movie",
        });
      });

      // Check URL path is as expected
      cy.get("[data-cy=router-pathname]").should("have.text", "/find");

      // And check that they are correctly displayed
      cy.get("header [data-cy=header-material-selector]").contains("Film");
      cy.get("header [data-cy=suggester-input]").should(
        "have.value",
        "some all"
      );
      cy.get("header [data-cy=search-input-title]").should(
        "have.value",
        "some title"
      );
      cy.get("header [data-cy=search-input-creator]").should(
        "have.value",
        "some creator"
      );
      cy.get("header [data-cy=search-input-subject]").should(
        "have.value",
        "some subject"
      );
    });

    it(`Go to find page when changing material type on work page`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header-material-page");
      cy.get("header [data-cy=header-material-selector]").click();
      cy.get("header [data-cy=item-movie] > [data-cy=text-film]").click();

      cy.get("[data-cy=router-pathname]").should("have.text", "/find");
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
      cy.get("header [data-cy=header-material-selector]").click();
      cy.get("header [data-cy=item-movie] > [data-cy=text-film]").click();
      cy.get("header [data-cy=suggester-input]").type("some all");
      cy.get("header [data-cy=search-input-title]").type("some title");
      cy.get("header [data-cy=search-input-creator]").type("some creator");
      cy.get("header [data-cy=search-input-subject]").type("some subject");
      cy.get("header [data-cy=header-searchbutton]").first().click();

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "some all",
          "q.title": "some title",
          "q.creator": "some creator",
          "q.subject": "some subject",
          workTypes: "movie",
        });
      });
      cy.get("[data-cy=router-pathname]").should("have.text", "/find");
      cy.get("[data-cy=router-action]").should("have.text", "push");
    });

    it(`Click input clear button should NOT be reflected in URL immediately`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");

      cy.get("header [data-cy=search-input-subject-clear]").click();

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "some all",
          "q.title": "some title",
          "q.creator": "some creator",
          "q.subject": "some subject",
          workTypes: "movie",
        });
      });
    });

    it(`Editing default search input, should not wipe other input`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");

      cy.get("[data-cy=suggester-input]").clear().type("something else");

      cy.get("[data-cy=header-searchbutton]").first().click();

      // Check URL query parameters are as expected
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "something else",
          "q.title": "some title",
          "q.creator": "some creator",
          "q.subject": "some subject",
          workTypes: "movie",
        });
      });
    });

    it(`All default input suggestions will search with q.all`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header");

      cy.get("header [data-cy=suggester-input]").clear().type("hest");

      cy.get("header [data-cy=suggester-container")
        .find("li")
        .should("have.length", 3);

      // Check creator, subject, and work
      [
        "suggest.result[0].term",
        "suggest.result[1].term",
        "suggest.result[2].term",
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

      cy.get("header [data-cy=suggester-input]").clear().type("hest");
      cy.tab();

      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({});
      });
    });

    it(`Pressing enter will sync with URL immediately`, () => {
      cy.visit("/iframe.html?id=layout-header--nav-header");

      cy.get("header [data-cy=suggester-input]").clear().type("hest{enter}");

      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({ "q.all": "hest" });
      });
    });
    describe(`Mobile`, () => {
      it(`Maintains input value when opening mobile suggester`, () => {
        cy.viewport("iphone-6");
        cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");

        cy.get("[data-cy=fake-search-input]").click();
        cy.get("[data-cy=suggester-input]").should("have.value", "some all");
      });

      it(`Hide mobile search button when expanded`, () => {
        cy.viewport("iphone-6");
        cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");
        cy.get("[data-cy=fake-search-input-button]").should("not.exist");
        cy.get(
          "[data-cy=expanded-search-mobile] [data-cy=text-færre-søgemuligheder]"
        )
          .scrollIntoView()
          .click();
        cy.get("[data-cy=fake-search-input-button]").should("exist");
      });

      it(`Click input clear on mobile should NOT be reflected in URL immediately`, () => {
        cy.viewport("iphone-6");
        cy.visit("/iframe.html?id=layout-header--nav-header-prefilled");
        cy.get("[data-cy=fake-search-input]").should("contain", "some all");
        cy.get("[data-cy=fake-search-input-clear]").should("be.visible");
        cy.get("[data-cy=fake-search-input-clear]").click();
        cy.get("[data-cy=fake-search-input-clear]").should("not.be.visible");
        cy.get("[data-cy=fake-search-input]").should("not.contain", "some all");

        // Check URL query parameters are as expected
        cy.get("[data-cy=router-query]").then((el) => {
          expect(JSON.parse(el.text())).to.deep.equal({
            "q.all": "some all",
            "q.title": "some title",
            "q.creator": "some creator",
            "q.subject": "some subject",
            workTypes: "movie",
          });
        });

        cy.get(
          "[data-cy=expanded-search-mobile] [data-cy=header-searchbutton]"
        ).click();

        cy.get("[data-cy=router-query]").then((el) => {
          expect(JSON.parse(el.text())).to.deep.equal({
            "q.title": "some title",
            "q.creator": "some creator",
            "q.subject": "some subject",
            workTypes: "movie",
          });
        });
      });
    });
  });

  describe(`Result`, () => {
    it(`Maps from URL params to a search result`, () => {
      cy.visit("/iframe.html?id=search-result--connected");
      cy.get("[data-cy=router-query]").then((el) => {
        expect(JSON.parse(el.text())).to.deep.equal({
          "q.all": "hest",
        });
      });

      cy.get("[data-cy=result-row]").should("have.length", 10);
    });
  });

  describe("ResultRow", () => {
    it("Should have all data", () => {
      cy.visit("/iframe.html?id=search-result-resultrow--with-all-data");

      cy.get("[data-cy=result-row]").should("exist");

      cy.get("[data-cy=ResultRow-title]")
        .should("exist")
        .should("contain", "Harry Potter");

      cy.get("[data-cy=text-joanne-k-rowling]")
        .should("exist")
        .should("contain", "Rowling");

      cy.get("[data-cy=result-row-laanemuligheder-wrap]").should("exist");
      cy.get("[data-cy=link]").should("exist").first().should("contain", "Bog");
      cy.get("[data-cy=cover-present]").should("exist");
    });

    it("should not have cover", () => {
      cy.visit("/iframe.html?id=search-result-resultrow--without-cover");

      cy.get("[data-cy=missing-cover]").should("exist");
    });

    it("should not have creator", () => {
      cy.visit("/iframe.html?id=search-result-resultrow--without-creator");

      cy.get("[data-cy=text-joanne-k-rowling]").should("not.exist");
    });

    it("should not have titles", () => {
      cy.visit("/iframe.html?id=search-result-resultrow--without-titles");

      cy.get("[data-cy=ResultRow-title]").should("exist").should("contain", "");
    });

    it("should not have materialTypes", () => {
      cy.visit(
        "/iframe.html?id=search-result-resultrow--without-material-types"
      );
      cy.get("[data-cy=result-row-laanemuligheder-wrap]")
        .should("exist")
        .should("not.contain", "Lånemuligheder");
      cy.get("[data-cy=link]").should("not.exist");
    });

    it("slow loading", () => {
      cy.visit("/iframe.html?id=search-result-resultrow--slow-loading");

      cy.get("[data-cy=skeleton]").should("exist");
    });
  });

  describe("Related search subjects", () => {
    it(`Can tab through related keywords`, () => {
      cy.visit("/iframe.html?id=search-relatedsubjects--default");
      cy.get("body").tab();
      cy.focused().should("have.attr", "data-cy", "related-subject-heste");
      cy.tabs(10);
      cy.focused().should("have.attr", "data-cy", "related-subject-heste");
    });

    it(`Can render and interact with connected related subjects`, () => {
      cy.visit("/iframe.html?id=search-relatedsubjects--connected");
      cy.get("[data-cy=words-container]").children().should("have.length", 2);

      cy.get("[data-cy=words-container]").each((el, idx) => {
        cy.get(el).click();
        cy.get("[data-cy=router-pathname]").should("have.text", "/find");
        cy.get("[data-cy=router-query]").should(
          "have.text",
          `{"q.subject":"relatedSubjects[${idx}]"}`
        );
      });
    });

    it(`Can visit keywords`, () => {
      cy.visit("/iframe.html?id=search-relatedsubjects--default");

      const tag = "ridning";
      const url = `/find?q.subject=${tag}`;

      // Get selected tag
      cy.get(`[data-cy=related-subject-${tag}]`)
        .should("have.attr", "target", "_self")
        .should("have.attr", "href", url);
    });

    it(`Will show search result hitcount in the connected related subjects section`, () => {
      cy.visit("/iframe.html?id=search-relatedsubjects--connected");

      cy.on("url:change", (url) => {
        expect(url).to.include("connected");
      });

      cy.get("[data-cy=text-resultater]").should("exist");

      cy.get("[data-cy=related-hitcount]")
        .should("exist")
        .should("have.text", "998");
    });

    it(`Will not show anything if empty`, () => {
      cy.visit("/iframe.html?id=search-relatedsubjects--empty");
      cy.get("[data-cy=words-container]").should("not.exist");
      cy.get("[data-cy=related-hitcount]").should("have.text", "0");
    });
  });
});

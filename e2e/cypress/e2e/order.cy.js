describe("Order", () => {
  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
      win.localStorage.clear();
    });
  });
  it("Order physical material fails and shows error modal correctly", () => {
    cy.visit(
      "/iframe.html?id=modal-order--order-physical-material-fails&viewMode=story"
    );
    //open order modal
    cy.contains("Bestil", { timeout: 10000 }).click();
    // Submit the order
    cy.get("[data-cy=button-godkend]")
      // .scrollIntoView()
      // .should("exist")
      .should("not.be.disabled")
      .click({ force: true });

    //order failed
    cy.get("[data-cy=error-occured-title]").should("exist");
    cy.get("[data-cy=order-failed-message").should("exist");
    cy.get("[data-cy=try-again").should("exist");
    cy.get("[data-cy=button-luk]").should("exist");
  });
});

describe("Order", () => {
  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
      win.localStorage.clear();
    });
  });
  it(`submits ILL order for pids that may be ordered`, () => {
    cy.visitWithConsoleSpy(
      "/iframe.html?id=modal-order--order-via-ill&viewMode=story"
    );
    cy.get("[data-cy=button-order-overview-enabled]", { timeout: 15000 })
      .should("exist")
      .contains("Bestil", { timeout: 10000 })
      .click();

    // Check that user blocking is not present
    cy.get("[data-cy=blocked-user]").should("not.exist");
    cy.get("[data-cy=button-godkend]")
      .should("exist")
      .should("not.be.disabled");

    // Show info about the manifestation/work
    cy.contains("Hugo i Sølvskoven");
    cy.contains("Linoleum Gummigulv");

    // Info about pickupbranch
    cy.contains("Test Bib");
    cy.contains("branches.result[0].postalAddress");
    cy.contains("branches.result[0].postalCode branches.result[0].city");

    // Info about the logged in user
    cy.contains("Bestilles af");
    cy.contains("Some Name");
    cy.get("[data-cy=input]").should("have.value", "some@mail.dk");

    // Submit the order
    cy.get("[data-cy=button-godkend]")
      .should("not.be.disabled", { timeout: 15000 })
      .click({ force: true });

    cy.contains("some-order-id", { timeout: 10000 });

    cy.getConsoleEntry("submitOrder").then((entry) => {
      expect(entry[1]).to.deep.equal({
        pids: ["some-pid-1", "some-pid-2"],
        pickUpBranch: "1237",
        userParameters: {
          userName: "Some Name",
          userMail: "some@mail.dk",
        },
      });
    });
  });

  it(`should not tab to order modal after it is closed`, () => {
    cy.visitWithConsoleSpy(
      "/iframe.html?id=modal-order--order-via-ill&viewMode=story"
    );
    cy.contains("Bestil", { timeout: 10000 }).click();

    // Check that user blocking is not present
    cy.get("[data-cy=blocked-user]").should("not.exist");

    cy.get("[data-cy=modal-dimmer]").should("exist");
    cy.contains("Luk").click();
    cy.get("body").tab();
    cy.get("[data-cy=modal-dimmer]").should("not.be.visible");
  });

  it("should handle failed checkorder and pickupAllowed=false", () => {
    it("should not tab to order modal after it is closed", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-via-ill&viewMode=story"
      );
      cy.contains("Bestil", { timeout: 10000 }).click();

      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");

      cy.get("[data-cy=modal-dimmer]").should("exist");
      cy.contains("Luk").click();
      cy.get("body").tab();
      cy.get("[data-cy=modal-dimmer]").should("not.be.visible");
    });
    cy.visitWithConsoleSpy(
      "/iframe.html?id=modal-order--pickup-not-allowed&viewMode=story"
    );
    cy.contains("Bestil", { timeout: 10000 }).click();

    // Check that user blocking is not present
    cy.get("[data-cy=blocked-user]").should("not.exist");

    cy.contains("Test Bib - no orders here");

    cy.contains(
      "Materialet kan ikke bestilles til det her afhentningssted. Vælg et andet."
    );
    cy.get("[data-cy=button-godkend]").should("be.disabled");
    cy.contains("Skift afhentning").click();
  });

  describe("Order periodica article ", () => {
    before(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear();
        win.localStorage.clear();
      });
    });

    // TODO: Fix
    it("should order indexed periodica article through digital article service", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-indexed-periodica-article&viewMode=story"
      );
      cy.contains("Bestil", { timeout: 10000 }).click();

      cy.contains("Hugo i Sølvskoven");

      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");
      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");

      cy.contains("Leveres via digital artikelservice");
      cy.contains("Godkend").click();
      cy.contains("Bestillingen blev gennemført");
      cy.contains(
        "Du vil modtage en email fra Det Kgl. Bibliotek med artiklen"
      );

      cy.getConsoleEntry("elbaPlaceCopy").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pid: "some-pid-4",
          userMail: "some@mail.dk",
          userName: "Some Name",
        });
      });
    });

    it("Should fail order indexed periodica article and open modal showing error", () => {
      cy.visit(
        "/iframe.html?id=modal-order--order-indexed-periodica-article-fails&viewMode=story"
      );
      //open order modal
      cy.contains("Bestil", { timeout: 10000 }).click();
      // Submit the order
      cy.get("[data-cy=button-godkend]").should("not.be.disabled").click();

      //order failed
      cy.get("[data-cy=error-occured-title]").should("exist");
      cy.get("[data-cy=try-again").should("exist");
      cy.get("[data-cy=button-luk]").should("exist");
    });

    it("should order indexed periodica article through ILL (when branch is not subscribed to article service)", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-indexed-periodica-article-ill&viewMode=story"
      );
      cy.contains("Bestil", { timeout: 10000 }).click();

      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");
      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");

      cy.contains("Test Bib");
      cy.contains(
        "Du får besked fra dit bibliotek når materialet er klar til afhentning"
      );
      cy.contains("Godkend").click();
      cy.contains("some-order-id", { timeout: 10000 });

      cy.getConsoleEntry("submitOrder").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pids: ["some-pid-4"],
          pickUpBranch: "1237",
          userParameters: {
            userName: "Some Name",
            userMail: "some@mail.dk",
          },
        });
      });
    });
  });

  describe("Order periodica volume", () => {
    it("should order full periodica volume through ILL, never through digital article service", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-periodica-volume&viewMode=story"
      );
      cy.contains("Bestil", { timeout: 10000 }).click();

      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");
      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");

      cy.contains("Test Bib - ILL and digital copy service");

      // Try to order without filling out form
      cy.get("[data-cy=button-godkend]").click();

      cy.contains("For at bestille skal du vælge udgave eller artikel");

      cy.contains("Vælg eksemplar eller artikel", { timeout: 1000 }).click();

      cy.get('[placeholder="Skriv årstal"]').type("1992");

      cy.get('[placeholder="Hæfte, nummer eller bind"]').type("8");

      cy.get('[data-cy="button-gem"]').click();

      cy.contains("Rediger eksemplar eller artikel", { timeout: 10000 }).should(
        "exist"
      );

      cy.get("[data-cy=button-godkend]").click();

      cy.contains("some-order-id", { timeout: 10000 });

      cy.getConsoleEntry("submitOrder").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pids: ["some-pid-5"],
          pickUpBranch: "1235",
          userParameters: {
            userName: "Some Name",
            userMail: "some@mail.dk",
          },
          publicationDateOfComponent: "1992",
          volume: "8",
        });
      });
    });

    it("should order specific article from a periodica volume through digital article service", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-periodica-volume&viewMode=story"
      );
      cy.contains("Bestil", { timeout: 10000 }).click();
      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");
      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");

      cy.contains("Vælg eksemplar eller artikel", { timeout: 1000 }).click();

      cy.get('[placeholder="Skriv årstal"]').type("1992");

      cy.get('[placeholder="Hæfte, nummer eller bind"]').type("8");

      cy.get('[data-cy="text-kun-interesseret-i-en-bestemt-artikel?"]').click();

      cy.get('[placeholder="Skriv artiklens forfatter"]').type("Test Testesen");

      cy.get('[placeholder="Forår og efterår i botanikerens have"]').type(
        "some title"
      );

      cy.get('[placeholder="150-154"]').type("100-104");

      cy.get('[data-cy="button-gem"]').click();

      cy.contains("Leveres via digital artikelservice");

      cy.get("[data-cy=button-godkend]").click();

      cy.contains(
        "Du vil modtage en email fra Det Kgl. Bibliotek med artiklen"
      );

      cy.getConsoleEntry("elbaPlaceCopy").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pid: "some-pid-5",
          userName: "Some Name",
          userMail: "some@mail.dk",
          publicationDateOfComponent: "1992",
          volumeOfComponent: "8",
          authorOfComponent: "Test Testesen",
          titleOfComponent: "some title",
          pagesOfComponent: "100-104",
        });
      });
    });

    it("should order specific article from a periodica volume through ILL (when branch is not subscribed to article service)", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-periodica-volume-only-ill&viewMode=story"
      );

      cy.contains("Bestil", { timeout: 10000 }).click();

      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");
      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");

      cy.contains("Vælg eksemplar eller artikel", { timeout: 1000 }).click();

      cy.get('[placeholder="Skriv årstal"]').type("1992");

      cy.get('[placeholder="Hæfte, nummer eller bind"]').type("8");

      cy.get('[data-cy="text-kun-interesseret-i-en-bestemt-artikel?"]').click();

      cy.get('[placeholder="Skriv artiklens forfatter"]').type("Test Testesen");

      cy.get('[placeholder="Forår og efterår i botanikerens have"]').type(
        "some title"
      );

      cy.get('[placeholder="150-154"]').type("100-104");

      cy.get('[data-cy="button-gem"]').click();

      // Check that its delivered via ILL
      cy.contains(
        "Du får besked fra dit bibliotek når materialet er klar til afhentning"
      );

      // Check that BlockedUser does not exist
      cy.get("[data-cy=button-godkend]").click({ force: true });

      //cy.get("[data-cy=button-godkend]").should("exist").click();
      cy.contains("some-order-id", { timeout: 10000 });

      cy.getConsoleEntry("submitOrder").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pids: ["some-pid-5"],
          pickUpBranch: "1237",
          userParameters: {
            userName: "Some Name",
            userMail: "some@mail.dk",
          },
          publicationDateOfComponent: "1992",
          volume: "8",
          authorOfComponent: "Test Testesen",
          titleOfComponent: "some title",
          pagination: "100-104",
        });
      });
    });
  });

  describe("Not blocked or Blocked user", () => {
    it("should not block users from loaning if they are not blocked", () => {
      cy.visit("/iframe.html?id=modal-order--not-blocked-user&viewMode=story");

      cy.contains("Bestil", { timeout: 10000 }).click();

      cy.get("[data-cy=blocked-user]").should("not.exist");

      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");
    });

    it("should block users from loaning if they are blocked", () => {
      cy.visit("/iframe.html?id=modal-order--blocked-user&viewMode=story");

      cy.contains("Bestil", { timeout: 10000 }).click();

      cy.get("[data-cy=blocked-user]")
        .should("exist")
        .find("a")
        .should("have.attr", "href", "/balleripraprup.dekaa");

      cy.get("[data-cy=button-godkend]").should("exist").should("be.disabled");
    });

    it("should disable link if not present", () => {
      cy.visit(
        "/iframe.html?id=modal-order-blockeduserinformation--blocked-user-no-url&viewMode=story"
      );

      cy.get("[data-cy=blocked-user]")
        .should("exist")
        .find("a")
        .should("not.have.attr", "url");
    });

    it("should disable link if not present", () => {
      cy.visit("/iframe.html?id=modal-order--library-without-loaner-check");

      //open modal
      cy.contains("Bestil", { timeout: 10000 }).click();
      cy.contains("No borrowerCheck");

      cy.get("[data-cy=button-godkend]").should("exist").should("be.enabled");
      cy.get("[data-cy=blocked-user]").should("not.exist");
    });

    it("User is blocked for one agency but not for another", () => {
      cy.visit(
        "/iframe.html?id=modal-order--user-with-one-agency-blocked-one-agency-not-blocked"
      );

      //starting with blocked agency
      cy.contains("Bestil", { timeout: 10000 }).click();
      cy.contains("Test Bib - User is blocked");
      cy.get("[data-cy=blocked-user]").should("exist");

      //switching to non-blocked agency
      cy.contains("Skift afhentning").should("be.visible").click();
      cy.get("[data-cy=show-branches-for-1]").should("exist").click();
      cy.contains("Test Bib - only physical via ILL").should("exist").click();

      //check can order on non-blocked agency
      cy.get("[data-cy=button-godkend]").should("exist").should("be.enabled");
      cy.get("[data-cy=blocked-user]").should("not.exist");
    });
  });
  describe("If user logs in with MitID - and has no libraries associated with user account", () => {
    it("should show an errormessage when user has no agencies", () => {
      cy.visit("/iframe.html?id=modal-order--no-user-agencies");
      cy.contains("Bestil", { timeout: 10000 }).should("exist").click();

      cy.contains(
        "Vi kan se at du ikke er registreret på et bibliotek?"
      ).should("exist");
    });
  });
});

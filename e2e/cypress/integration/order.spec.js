describe("Order", () => {
  it(`submits ILL order for pids that may be ordered`, () => {
    cy.visitWithConsoleSpy(
      "/iframe.html?id=modal-order--order-via-ill&viewMode=story"
    );
    cy.contains("Bestil").click();

    // Check that user blocking is not present
    cy.get("[data-cy=blocked-user]").should("not.exist");
    cy.get("[data-cy=button-godkend]")
      .should("exist")
      .should("not.be.disabled");

    // Show info about the manifestation/work
    cy.contains("Hugo i Sølvskoven");
    cy.contains(
      "manifestations[0].creators[0].display, manifestations[0].creators[1].display"
    );

    // Info about pickupbranch
    cy.contains("Test Bib");
    cy.contains("user.agency.result[0].postalAddress");
    cy.contains("user.agency.result[0].postalCode user.agency.result[0].city");

    // Info about the logged in user
    cy.contains("Bestilles af");
    cy.contains("Some Name");
    cy.get("[data-cy=input]").should("have.value", "some@mail.dk");

    // Submit the order
    cy.contains("Godkend").click();
    cy.contains("some-order-id", { timeout: 500 });

    cy.getConsoleEntry("submitOrder").then((entry) => {
      expect(entry[1]).to.deep.equal({
        pids: ["some-pid-1", "some-pid-2"],
        pickUpBranch: "user.agency.result[0].branchId",
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
    cy.contains("Bestil").click();

    // Check that user blocking is not present
    cy.get("[data-cy=blocked-user]").should("not.exist");

    cy.get("[data-cy=modal-dimmer]").should("be.visible");
    cy.contains("Luk").click();
    cy.get("body").tab();
    cy.get("[data-cy=modal-dimmer]").should("not.be.visible");
  });

  it("should handle failed checkorder and pickupAllowed=false", () => {
    cy.visitWithConsoleSpy(
      "/iframe.html?id=modal-order--pickup-not-allowed&viewMode=story"
    );
    cy.contains("Bestil").click();

    // Check that user blocking is not present
    cy.get("[data-cy=blocked-user]").should("not.exist");

    cy.contains("Test Bib - no orders here");

    cy.contains(
      "Materialet kan ikke bestilles til det her afhentningssted. Vælg et andet."
    );
    cy.get("[data-cy=button-godkend]").should("be.disabled");
    cy.get("[data-cy=text-skift-afhentning]").click();
  });

  describe("Order periodica article ", () => {
    it("should order indexed periodica article through digital article service", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-indexed-periodica-article&viewMode=story"
      );
      cy.contains("Bestil").click();

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

      cy.getConsoleEntry("submitPeriodicaArticleOrder").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pickUpBranch: "user.agency.result[0].branchId",
          pid: "some-pid-4",
          userMail: "some@mail.dk",
          userName: "Some Name",
        });
      });
    });

    it("should order indexed periodica article through ILL (when branch is not subscribed to article service)", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-indexed-periodica-article-ill&viewMode=story"
      );
      cy.contains("Bestil").click();

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
      cy.contains("some-order-id");

      cy.getConsoleEntry("submitOrder").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pids: ["some-pid-4"],
          pickUpBranch: "user.agency.result[0].branchId",
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
      cy.contains("Bestil").click();

      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");
      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");

      cy.contains("Test Bib - ILL and digital copy service");

      // Try to order without filling out form
      cy.get("[data-cy=button-godkend]").click();

      cy.contains("For at bestille skal du vælge udgave eller artikel");

      cy.get('[data-cy="text-vælg-udgave-eller-artikel"]').click();

      cy.get('[placeholder="Skriv årstal"]').type("1992");

      cy.get('[placeholder="Hæfte, nummer eller bind"]').type("8");

      cy.get('[data-cy="button-gem"]').click();

      cy.get("[data-cy=button-godkend]").click();

      cy.contains("some-order-id");

      cy.getConsoleEntry("submitOrder").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pids: ["some-pid-5"],
          pickUpBranch: "user.agency.result[0].branchId",
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
      cy.contains("Bestil").click();
      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");
      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");

      cy.get('[data-cy="text-vælg-udgave-eller-artikel"]').click();

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

      cy.getConsoleEntry("submitPeriodicaArticleOrder").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pid: "some-pid-5",
          pickUpBranch: "user.agency.result[0].branchId",
          userName: "Some Name",
          userMail: "some@mail.dk",
          publicationDateOfComponent: "1992",
          volume: "8",
          authorOfComponent: "Test Testesen",
          titleOfComponent: "some title",
          pagination: "100-104",
        });
      });
    });

    it("should order specific article from a periodica volume through ILL (when branch is not subscribed to article service)", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?id=modal-order--order-periodica-volume-only-ill&viewMode=story"
      );

      cy.contains("Bestil").click();

      // Check that user blocking is not present
      cy.get("[data-cy=blocked-user]").should("not.exist");
      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");

      cy.get('[data-cy="text-vælg-udgave-eller-artikel"]').click();

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
      cy.get("[data-cy=button-godkend]").click();

      cy.contains("some-order-id");

      cy.getConsoleEntry("submitOrder").then((entry) => {
        expect(entry[1]).to.deep.equal({
          pids: ["some-pid-5"],
          pickUpBranch: "user.agency.result[0].branchId",
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

      cy.contains("Bestil").click();

      cy.get("[data-cy=blocked-user]").should("not.exist");

      cy.get("[data-cy=button-godkend]")
        .should("exist")
        .should("not.be.disabled");
    });

    it("should block users from loaning if they are blocked", () => {
      cy.visit("/iframe.html?id=modal-order--blocked-user&viewMode=story");

      cy.contains("Bestil").click();

      cy.get("[data-cy=blocked-user]")
        .should("exist")
        .find("a")
        .should("have.attr", "href", "balleripraprup.dekaa");

      cy.get("[data-cy=button-godkend]").should("exist").should("be.disabled");
    });
  });
});

describe("Multi Order", () => {
  before(() => {
    cy.window().then((win) => {
      win.sessionStorage.clear();
      win.localStorage.clear();
    });
  });

  describe("Unauthenticated user", () => {
    it("Show login modal page", () => {
      cy.visit(
        "/iframe.html?args=&id=order-multiorder--unauthenticated-user&viewMode=story"
      );
      cy.contains("Bestil single").click();

      cy.contains("Log ind via dit bibliotek");
    });
    it("Should require loaner form to be filled, when ordering to agency without borchk", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--unauthenticated-user&viewMode=story"
      );
      cy.contains("Bestil single").click();
      cy.get('[data-cy="pickup-search-input"]').type("a");

      cy.contains("Branch - No borrowercheck").click();

      cy.get('[data-cy="input-cpr"]').type("123456");
      cy.contains("Gå til bestilling").click();

      cy.contains("Du mangler at udfylde din e-mail");
      cy.get('[data-cy="input"]').clear().type("test@dbc.dk");
      cy.contains("Godkend").click();

      cy.contains("Bestillingen blev gennemført");

      cy.getConsoleEntry("submitMultipleOrders").then((entry) => {
        expect(entry[1]).to.deep.equal({
          materialsToOrder: [
            { key: "WORK_ILL_ACCESSBOOK", pids: ["PID_ILL_ACCESS"] },
          ],
          pickUpBranch: "BRANCH_NO_BORROWERCHECK",
          userParameters: {
            barcode: "session.userParameters.barcode",
            cardno: "session.userParameters.cardno",
            cpr: "123456",
            customId: "session.userParameters.customId",
            userAddress: "session.userParameters.userAddress",
            userDateOfBirth: "session.userParameters.userDateOfBirth",
            userId: "session.userParameters.userId",
            userMail: "test@dbc.dk",
            userName: "session.userParameters.userName",
            userTelephone: "session.userParameters.userTelephone",
          },
        });
      });
    });
  });

  describe("Authenticated user", () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear();
        win.localStorage.clear();
      });
    });
    it("Show mail from agency as default", () => {
      cy.visit(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil single", { timeout: 10000 }).click();

      cy.get('[data-cy="input"]').should("have.value", "test@test.dk");
    });

    it("Should order single material via ILL", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil single").click();

      cy.get('[data-cy="submit-button"]').click();

      // submit button disabled, while submitting order
      cy.get('[data-cy="submit-button"]').should("be.disabled");

      cy.contains("Bestillingen blev gennemført");

      cy.contains(
        "Du vil få besked når dine materialer er klar til afhentning på Branch - Modtager ILL"
      );

      cy.contains("Gå til bestillingshistorik");

      cy.getConsoleEntry("submitMultipleOrders").then((entry) => {
        expect(entry[1]).to.deep.equal({
          materialsToOrder: [
            { key: "WORK_ILL_ACCESSBOOK", pids: ["PID_ILL_ACCESS"] },
          ],
          pickUpBranch: "BRANCH_ACCEPT_ILL",
          userParameters: {
            userName: "Indlogget bruger - navn",
            userMail: "test@test.dk",
          },
        });
      });
    });

    it("Should show failed material in receipt", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil med fejl i kvittering").click();

      cy.get('[data-cy="submit-button"]').click();

      cy.contains("Bestillingsoversigt");

      cy.contains("1 materiale kunne ikke bestilles!");

      cy.getConsoleEntry("submitMultipleOrders").then((entry) => {
        expect(entry[1]).to.deep.equal({
          materialsToOrder: [
            {
              key: "WORK_ILL_ACCESS_FAILSBOOK",
              pids: ["PID_ILL_ACCESS_FAILS"],
            },
          ],
          pickUpBranch: "BRANCH_ACCEPT_ILL",
          userParameters: {
            userName: "Indlogget bruger - navn",
            userMail: "test@test.dk",
          },
        });
      });
    });
    it("should NOT contain pincode field", () => {
      cy.visit(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil single ILL").click();
      cy.get("[data-cy=pincode-input]").should("not.exist");
    });
    it("should contain pincode field", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil single ILL").click();
      cy.get("[data-cy=pincode-input]").should("not.exist");

      cy.contains("Modtager ILL");
      cy.contains("Skift afhentning").click();
      cy.contains("Agency - Requires pincode").click();
      cy.contains("Branch - Requires pincode").click();

      cy.get('[data-cy="submit-button"]').should("be.disabled");

      cy.contains("Biblioteket kræver en pinkode ved bestilling");
      cy.contains("Du mangler at angive en pinkode");

      cy.get('[data-cy="pincode-input"]').type("1234");
      cy.get('[data-cy="submit-button"]').click();

      cy.contains("Bestillingen blev gennemført");

      cy.getConsoleEntry("submitMultipleOrders").then((entry) => {
        expect(entry[1]).to.deep.equal({
          materialsToOrder: [
            {
              key: "WORK_ILL_ACCESSBOOK",
              pids: ["PID_ILL_ACCESS"],
            },
          ],
          pickUpBranch: "BRANCH_REQUIRES_PINCODE",
          userParameters: {
            userName: "Indlogget bruger - navn",
            userMail: "test@test.dk",
            pincode: "1234",
          },
        });
      });
    });

    it("should show error when check order fails", () => {
      cy.visit(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil single ILL").click();

      // wait for library to load
      cy.contains("Modtager ILL");

      cy.contains("Skift afhentning").click();
      cy.contains("Agency - Checkorder fejler").click();
      cy.contains("Branch - Checkorder fejler").click();

      cy.contains("Kan ikke bestilles til dit bibliotek");
      cy.contains(
        "Materialet kan ikke bestilles til det her afhentningssted. Vælg et andet."
      );

      cy.contains("1 materiale kan ikke bestilles");
      cy.get('[data-cy="submit-button"]').should("be.disabled");
    });

    it("should order digital article", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil digital artikel").click();
      cy.contains("PID_DIGITAL_ACCESS");

      cy.contains("Leveres som digital kopi til din mail");

      cy.contains("Afhentningssted").should("not.exist");
      cy.contains("1 materiale bliver leveret som digital kopi til din mail");

      cy.contains("Godkend").click();

      cy.contains("Bestillingen blev gennemført");

      cy.contains(
        "Digitale artikler bliver leveret til din mail fra det Det Kgl. Bibliotek"
      );

      cy.getConsoleEntry("submitMultipleOrders").then((entry) => {
        expect(entry[1]).to.deep.equal({
          materialsToOrder: [
            {
              key: "WORK_DIGITAL_ACCESSBOOK",
              pids: ["PID_DIGITAL_ACCESS"],
            },
          ],
          pickUpBranch: "BRANCH_ACCEPT_ILL",
          userParameters: {
            userName: "Indlogget bruger - navn",
            userMail: "test@test.dk",
          },
        });
      });
    });

    it("Should order full periodicas via ILL", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );

      cy.contains("Bestil tidsskrifter").click();

      cy.contains("PID_PERIODICA_1 - full");
      cy.contains("PID_PERIODICA_2 - full");

      cy.contains("2 materialer mangler at få udfyldt informationer");

      cy.get('[data-cy="submit-button"]').should("be.disabled");

      // Edit first periodica
      cy.contains("Vælg eksemplar eller artikel").first().click();
      cy.get('[data-cy="input-publicationDateOfComponent"]').type("1999");
      cy.contains("Gem").click();

      cy.contains("1 materiale mangler at få udfyldt informationer");
      cy.get('[data-cy="submit-button"]').should("be.disabled");

      // Edit second periodica
      cy.contains("Vælg eksemplar eller artikel").click();
      cy.get('[data-cy="input-publicationDateOfComponent"]').type("2000");
      cy.contains("Gem").click();

      cy.contains("År: 1999");
      cy.contains("År: 2000");

      cy.get('[data-cy="submit-button"]').should("be.enabled");

      cy.get('[data-cy="submit-button"]').click();

      cy.contains("Bestillingen blev gennemført");
      cy.contains("2 materialer er bestilt");

      cy.contains(
        "Du vil få besked når dine materialer er klar til afhentning på Branch - Modtager ILL"
      );

      cy.contains(
        "Digitale artikler bliver leveret til din mail fra det Det Kgl. Bibliotek"
      ).should("not.exist");

      cy.getConsoleEntry("submitMultipleOrders").then((entry) => {
        expect(entry[1]).to.deep.equal({
          materialsToOrder: [
            {
              key: "WORK_PERIODICA_1BOOK",
              pids: ["PID_PERIODICA_1"],
              periodicaForm: {
                pid: "PID_PERIODICA_1",
                publicationDateOfComponent: "1999",
              },
            },
            {
              key: "WORK_PERIODICA_2BOOK",
              pids: ["PID_PERIODICA_2"],
              periodicaForm: {
                pid: "PID_PERIODICA_2",
                publicationDateOfComponent: "2000",
              },
            },
          ],
          pickUpBranch: "BRANCH_ACCEPT_ILL",
          userParameters: {
            userName: "Indlogget bruger - navn",
            userMail: "test@test.dk",
          },
        });
      });
    });
    it("Should order specific article from periodica via Digital Article Service and ILL (prefer digital)", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );

      cy.contains("Bestil tidsskrifter").click();

      cy.contains("PID_PERIODICA_1 - full");

      // Edit first periodica
      cy.contains("Vælg eksemplar eller artikel").first().click();
      cy.get('[data-cy="input-publicationDateOfComponent"]').type("1999");
      cy.contains("Kun interesseret i en bestemt artikel").click();
      cy.get('[data-cy="input-authorOfComponent"]').should("be.visible");
      cy.get('[data-cy="input-authorOfComponent"]').type("author");
      cy.contains("Gem").click();

      // Edit second periodica
      cy.contains("Vælg eksemplar eller artikel").first().click();
      cy.get('[data-cy="input-publicationDateOfComponent"]').type("2000");
      // cy.contains("Kun interesseret i en bestemt artikel").click();
      cy.get('[data-cy="input-authorOfComponent"]').should("be.visible");
      cy.get('[data-cy="input-authorOfComponent"]').type("another author");
      cy.contains("Gem").click();

      cy.contains("1 materiale bliver leveret som digital kopi til din mail");

      cy.get('[data-cy="submit-button"]').click();

      cy.contains("Bestillingen blev gennemført");
      cy.contains("2 materialer er bestilt");

      cy.contains(
        "Du vil få besked når dine materialer er klar til afhentning på Branch - Modtager ILL"
      );
      cy.contains(
        "Digitale artikler bliver leveret til din mail fra det Det Kgl. Bibliotek"
      );

      cy.getConsoleEntry("submitMultipleOrders").then((entry) => {
        expect(entry[1]).to.deep.equal({
          materialsToOrder: [
            {
              key: "WORK_PERIODICA_1BOOK",
              pids: ["PID_PERIODICA_1"],
              periodicaForm: {
                pid: "PID_PERIODICA_1",
                authorOfComponent: "author",
                publicationDateOfComponent: "1999",
              },
            },
            {
              key: "WORK_PERIODICA_2BOOK",
              pids: ["PID_PERIODICA_2"],
              periodicaForm: {
                pid: "PID_PERIODICA_2",
                authorOfComponent: "another author",
                publicationDateOfComponent: "2000",
              },
            },
          ],
          pickUpBranch: "BRANCH_ACCEPT_ILL",
          userParameters: {
            userName: "Indlogget bruger - navn",
            userMail: "test@test.dk",
          },
        });
      });
    });
    it("Should warn about already ordered material, order material anyway", () => {
      cy.visit(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil single ILL").click();
      cy.contains("PID_ILL_ACCESS - full");
      cy.contains("Branch - Modtager ILL");

      cy.contains("Godkend").click();
      cy.get('[data-cy="multiorder-button-close"]').click();
      cy.contains("Bestil single ILL").click();

      cy.contains("Du har allerede bestilt en udgave af dette materiale");
      cy.get('[data-cy="submit-button"]').should("be.disabled");
      cy.contains("Bestil alligevel").click();
      cy.get('[data-cy="submit-button"]').click();
      cy.contains("1 materiale er bestilt");
    });
    it("Should warn about already ordered material, remove material from order list", () => {
      cy.visit(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil single ILL").click();
      cy.contains("PID_ILL_ACCESS - full");
      cy.contains("Branch - Modtager ILL");

      cy.contains("Godkend").click();
      cy.get('[data-cy="multiorder-button-close"]').click();
      cy.contains("Bestil single ILL").click();

      cy.contains("Du har allerede bestilt en udgave af dette materiale");
      cy.get('[data-cy="submit-button"]').should("be.disabled");
      cy.contains("Bestil ikke").click();
      cy.contains("Der er ingen materialer i din bestillingsliste");
    });
    it("Should warn about e-materials that can't be ordered", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil e-bog").click();

      cy.contains("1 materiale findes online, og kræver ikke bestilling");
      cy.contains("Der er ingen materialer der kræver bestilling");
      cy.contains("Tilbage").click();
    });
    it("Should warn about e-materials that can't be ordered, but proceed to 1 that can", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil e-bog og fysisk").click();

      cy.contains("1 materiale findes online, og kræver ikke bestilling");
      cy.contains("På næste side vises det materiale, som du kan bestille");
      cy.contains("Næste").click();
    });
    it("Should show error when user is blocked at agency", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--authenticated-user&viewMode=story"
      );
      cy.contains("Bestil single ILL").click();

      cy.contains("Branch - Modtager ILL");

      cy.contains("Skift afhentning").click();
      cy.contains("Agency - Blocks users").click();
      cy.contains("Branch - Blocks users").click();

      cy.contains("Biblioteket modtager desværre ikke bestillinger fra dig");
      cy.get('[data-cy="submit-button"]').should("be.disabled");
    });
  });

  describe("Mitid user", () => {
    it("should show an errormessage when user has no agencies", () => {
      cy.visitWithConsoleSpy(
        "/iframe.html?args=&id=order-multiorder--mit-id-no-agencies&viewMode=story"
      );

      cy.contains("Bestil single ILL").click();

      cy.contains("Vi kan se at du ikke er registreret på et bibliotek?");
    });
  });
});

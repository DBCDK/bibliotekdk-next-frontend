const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiPath");

describe(`Different ways to open login modal with library that has borrowerCheck `, () => {
  //TODO fix with https://dbcjira.atlassian.net/browse/BIBDK2021-2027
  it("Plain login from login button in header", () => {
    cy.visit(nextjsBaseUrl);
    cy.consentAllowAll(); //allow cookies
    cy.get("[data-cy=header-link-login]").should("be.visible").click();
    cy.get("[data-cy=pickup-search-input]").should("be.visible").type("Val");
    cy.contains("Valby Bibliotek").click();
    cy.get("[data-cy=go-to-library-login]").should("be.visible");
  });

  it("Plain login from login button on profile page", () => {
    cy.visit(nextjsBaseUrl + "/profil");
    cy.consentAllowAll();
    cy.get("[data-cy=profile-layout-button-login]").click();
    cy.get("[data-cy=text-log-ind]").should("be.visible");
  });

  it("Infomedia shows correct login modal", () => {
    cy.fixture("articlepublicdata.json").then((fixture) => {
      cy.intercept("POST", `${fbiApiPath}`, (req) => {
        if (req?.body?.variables?.workId === "work-of:870971-tsart:39160846") {
          req.reply(fixture);
        }
      });
    });
    cy.visit(
      `${nextjsBaseUrl}/infomedia/en-artikel/work-of:870971-tsart:39160846/e842b5ee`
    );
    cy.consentAllowAll();
    cy.get("[data-cy=article-prompt-button-log-ind]")
      .should("be.visible")
      .click();
    cy.get("[data-cy=text-log-ind]").should("be.visible");
    cy.get("[data-cy=pickup-search-input]").should("be.visible").type("Val");
    cy.contains("Valby Bibliotek").should("be.visible").click();
  });
  //bestil should open login modal directly --> test in reservation button
});

describe(`Different ways to open login modal with a (FFU) library that does NOT have borrowerCheck`, () => {
  it("Plain login from login button in header not supported & back button leads back to pick up branch search", () => {
    cy.visit(nextjsBaseUrl);
    cy.consentAllowAll();
    cy.get("[data-cy=header-link-login]").should("be.visible").click();
    cy.get("[data-cy=pickup-search-input]")
      .should("be.visible")
      .type("CBS Bibliotek");
    cy.get('[data-cy="text-CBS Bibliotek - Solbjerg Plads"]')
      .should("be.visible")
      .click();
    cy.get(
      '[data-cy="text-cbs-bibliotek-login-kan-ikke-bruges-på-bibliotek.dk"]'
    ).should("be.visible");
    cy.get("[data-cy=button-tilbage]").should("be.visible").click();
    cy.get("[data-cy=pickup-search-input]").should("be.visible");
  });

  it("Plain login from login button on profile page not supported & back button leads back to pick up branch search", () => {
    cy.visit(nextjsBaseUrl + "/profil");
    cy.consentAllowAll();
    cy.get("[data-cy=profile-layout-button-login]").click();
    cy.get("[data-cy=pickup-search-input]")
      .should("be.visible")
      .type("CBS Bibliotek");
    cy.get('[data-cy="text-CBS Bibliotek - Solbjerg Plads"]')
      .should("be.visible")
      .click();
    cy.get(
      '[data-cy="text-cbs-bibliotek-login-kan-ikke-bruges-på-bibliotek.dk"]'
    ).should("be.visible");
    cy.get("[data-cy=button-tilbage]").should("be.visible").click();
    cy.get("[data-cy=pickup-search-input]").should("be.visible");
  });

  it("Infomedia login not supported & back button leads back to pick up branch search", () => {
    cy.fixture("articlepublicdata.json").then((fixture) => {
      cy.intercept("POST", `${fbiApiPath}`, (req) => {
        if (req?.body?.variables?.workId === "work-of:870971-tsart:39160846") {
          req.reply(fixture);
        }
      });
    });
    cy.visit(
      `${nextjsBaseUrl}/infomedia/en-artikel/work-of:870971-tsart:39160846/e842b5ee`
    );
    cy.consentAllowAll();
    cy.get("[data-cy=article-prompt-button-log-ind]")
      .should("be.visible")
      .click();
    cy.get("[data-cy=text-log-ind]").should("be.visible");
    cy.get("[data-cy=pickup-search-input]")
      .should("be.visible")
      .type("CBS Bibliotek");
    cy.get('[data-cy="text-CBS Bibliotek - Solbjerg Plads"]')
      .should("be.visible")
      .click();
    cy.get(
      '[data-cy="text-cbs-bibliotek-login-kan-ikke-bruges-på-bibliotek.dk"]'
    ).should("be.visible");
    cy.get("[data-cy=button-tilbage]").should("be.visible").click();
    cy.get("[data-cy=pickup-search-input]").should("be.visible");
  });
});

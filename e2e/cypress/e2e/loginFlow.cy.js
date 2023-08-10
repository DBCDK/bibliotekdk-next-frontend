const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const fbiApiPath = Cypress.env("fbiApiPath");

describe(`Different ways to open login modal with library that has borrowerCheck `, () => {
  it("Plain login from login button in header", () => {
    cy.visit(nextjsBaseUrl);
    cy.consentAllowAll(); //allow cookies
    cy.get("[data-cy=header-link-login]").should("be.visible").click();
    cy.get("[data-cy=pickup-search-input]").should("be.visible").type("Val");
    cy.contains("Valby Bibliotek").click();
    cy.get("[data-cy=button-log-ind]").should("be.visible");
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
    cy.contains("Valby Bibliotek").click();
  });

  //TODO bestil should open login modal directly
  // it("Plain login from book reservation", () => {
  //  cy.fixture("articlepublicdata.json").then((fixture) => {
  //   cy.intercept("POST", `${fbiApiPath}`, (req) => {
  //     if (req?.body?.variables?.workId === "work-of:870971-tsart:39160846") {
  //       req.reply(fixture);
  //     }
  //   });
  // });
  // cy.visit(
  //   `${nextjsBaseUrl}/infomedia/en-artikel/work-of:870971-tsart:39160846/e842b5ee`
  // );
  // cy.consentAllowAll();
  // cy.get("[data-cy=button-order-overview-enabled]")
  //   .should("be.visible")
  //   .click();
  // });

  //SUBSCRIPTION

  //DDA
});

describe(`Different ways to open login modal with a (FFU) library that does NOT have borrowerCheck`, () => {
  it("Plain login from login button in header not supported & back button leads back to pick up branch search", () => {
    cy.visit(nextjsBaseUrl);
    cy.consentAllowAll();
    cy.get("[data-cy=header-link-login]").should("be.visible").click();
    cy.get("[data-cy=pickup-search-input]")
      .should("be.visible")
      .type("CBS Bibliotek");
    cy.contains("CBS Bibliotek - Solbjerg Plads").click();
    cy.get("[data-cy=text-log-ind-via-cbs-bibliotek-understøttes-ikke]").should(
      "be.visible"
    );
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
    cy.contains("CBS Bibliotek - Solbjerg Plads").click();
    cy.get("[data-cy=text-log-ind-via-cbs-bibliotek-understøttes-ikke]").should(
      "be.visible"
    );
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
    cy.contains("CBS Bibliotek - Solbjerg Plads").click();
    cy.get("[data-cy=text-log-ind-via-cbs-bibliotek-understøttes-ikke]").should(
      "be.visible"
    );
    cy.get("[data-cy=button-tilbage]").should("be.visible").click();
    cy.get("[data-cy=pickup-search-input]").should("be.visible");
  });

  //TODO add bestil flow ORDER_PHYSICAL & DIGITAL_COPY -->  opens loaner form

  //SUBSCRIPTION

  //DDA
});

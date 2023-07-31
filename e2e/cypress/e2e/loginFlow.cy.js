const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe(`Different ways to open login modal with library with borrowerCheck `, () => {
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
    cy.get('[class^="ProfileLayout_loginButton__sdKEd"]') //we can have two login buttons on the page, take the one where classname starts with this
      .should("be.visible")
      .click();
    cy.get("[data-cy=text-log-ind]").should("be.visible");
  });

  it("Infomedia shows correct login modal", () => {
    cy.visit(
      nextjsBaseUrl +
        "/infomedia/politiken/work-of:870971-avis:87043134/Y4074532" //TODO could this article disappear? should i mock this here?
    );
    cy.consentAllowAll();
    cy.get("[data-cy=button-log-ind]")
      .filter((index, element) => {
        const classes = element.className.split(" ");
        return classes.some((cls) => cls.includes("primary")); //we can have two login buttons on the page, where class contains "primary"
      })
      .first()
      .should("be.visible")
      .click();
    cy.get("[data-cy=text-log-ind]").should("be.visible");
    cy.get("[data-cy=pickup-search-input]").should("be.visible").type("Val");
    cy.contains("Valby Bibliotek").click();
    cy.get("[data-cy=text-læs-artiklen-fra-infomedia]").should("be.visible");
  });

  //TODO bestil should open login modal directly
  // it("Plain login from book reservation", () => {
  // cy.visit(
  //   nextjsBaseUrl +
  //     "/materiale/harry-potter-og-de-vises-sten_joanne-k-rowling/work-of%3A870970-basis%3A22629344?type=bog" //TODO should i mock this here?
  // );
  // cy.consentAllowAll();
  // cy.get("[data-cy=button-order-overview-enabled]")
  //   .should("be.visible")
  //   .click();
  // });

  //SUBSCRIPTION

  //DDA
});

describe(`Different ways to open login modal with (FFU) library WITHOUT borrowerCheck`, () => {
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
    cy.get("[data-cy=button-log-ind]")
      .filter((index, element) => {
        const classes = element.className.split(" ");
        return classes.some((cls) => cls.includes("primary")); //we can have two login buttons on the page, take one with classname contains "primary"
      })
      .first()
      .should("be.visible")
      .click();
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
    cy.visit(
      nextjsBaseUrl +
        "/infomedia/politiken/work-of:870971-avis:87043134/Y4074532" //TODO could this article disappear? should i mock this here?
    );
    cy.consentAllowAll();
    cy.get("[data-cy=button-log-ind]")
      .filter((index, element) => {
        const classes = element.className.split(" ");
        return classes.some((cls) => cls.includes("primary")); //we can have two login buttons on the page, take one that contains "primary"
      })
      .first()
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

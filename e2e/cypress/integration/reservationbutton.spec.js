/**
 * @file
 * Test functionality of reservation button - see also @overview.spec.js
 */

function mockLogin() {
  cy.intercept("/api/auth/session", {
    body: {
      user: {
        uniqueId: "3ad8276b-43ed-430e-891d-3238996da656",
        agencies: [
          { agencyId: "190110", userId: "lkh@dbc.dk", userIdType: "LOCAL" },
          { agencyId: "191977", userId: "10003", userIdType: "LOCAL" },
          { agencyId: "191977", userId: "0102033696", userIdType: "CPR" },
          { agencyId: "790900", userId: "C04122017435", userIdType: "LOCAL" },
        ],
      },
      expires: "2021-06-26T07:00:09.408Z",
      accessToken: "dummy-token",
    },
  });
  cy.fixture("user.json").then((fixture) => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("user {")) {
        req.reply(fixture);
      }
    });
  });
}

function mockFullWork() {
  cy.fixture("fullwork.json").then((fixture) => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("work(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockAvailability() {
  cy.fixture("fullmanifestation.json").then((fixture) => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("manifestation(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockUnAvailable() {
  cy.fixture("manifestationunavailable.json").then((fixture) => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("manifestation(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockSubmitOrder() {
  cy.fixture("submitorder.json").then((fixture) => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("submitOrder(")) {
        req.reply(fixture);
        req.alias = "submitOrder";
      }
    });
  });
}

describe("Reservation button", () => {
  it.skip(`user logged in material available`, () => {
    mockFullWork();
    mockSubmitOrder();
    mockLogin();
    mockAvailability();
    cy.visit("/iframe.html?id=work-overview--reservation-button-active");
    cy.get("[data-cy=button-order-overview-enabled]")
      .contains("Bestil")
      .click({ force: true });

    cy.get("[data-cy=button-order-overview-enabled]")
      .contains("Bestil")
      .click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("order");
    });
  });

  it(`user logged in material unavailable`, () => {
    mockFullWork();
    mockSubmitOrder();
    mockLogin();
    mockUnAvailable();
    cy.visit("/iframe.html?id=work-overview--reservation-button-active");
    cy.get("[data-cy=button-order-overview]").should("be.disabled");
  });

  // @TODO more testing - request_button:false eg.
});

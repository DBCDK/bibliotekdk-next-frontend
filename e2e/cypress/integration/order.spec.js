/**
 * @file
 * Test functionality of Order modal
 */

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

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

describe("Order", () => {
  beforeEach(function () {
    mockFullWork();
    mockAvailability();
    mockSubmitOrder();
    mockLogin();
  });

  it("submits order - happy path", () => {
    cy.visit(
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763`
    );

    // Wait for content to be loaded
    cy.get("[data-cy=button-order-overview-enabled]");
    cy.wait(500);

    // Open order modal
    cy.get("[data-cy=button-order-overview-enabled]").click();

    // Work info in modal is visible
    cy.get('[data-cy="text-hest,-hest,-tiger,-tiger"]').should("be.visible");

    // Pickup branch is visible
    cy.get('[data-cy="text-b.-adresse"]').should("be.visible");
    cy.get("[data-cy=text-dbctestbibliotek]").should("be.visible");

    // name of user is visible
    cy.get("[data-cy=text-freja-damgaard]")
      .scrollIntoView()
      .should("be.visible");

    // Change pickup branch
    cy.get("[data-cy=text-vælg-afhentning]").click();
    cy.get("[data-cy=text-dbc-bibilioteksekspressen]").click();
    cy.get('[data-cy="text-vsn-b.adresse"]').should("be.visible");
    cy.get("[data-cy=text-dbc-bibilioteksekspressen]").should("be.visible");

    // Type email
    cy.get("#order-user-email").type("freja@dbc.dk");

    // submit order
    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitOrder").then((order) => {
      expect(order.request.body.variables.input).to.deep.equal({
        email: "freja@dbc.dk",
        pickUpBranch: "790903",
        pids: ["870970-basis:51701763", "870970-basis:12345678"], // all pids for selected materialtype (bog)
      });
    });

    cy.contains("Bestillingen blev gennemført");
  });
});

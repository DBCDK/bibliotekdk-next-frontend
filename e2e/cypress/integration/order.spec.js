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

function openOrderModal() {
  // Wait for content to be loaded
  cy.get("[data-cy=button-order-overview-enabled]");
  cy.wait(500);

  // Open order modal
  cy.get("[data-cy=button-order-overview-enabled]").click();
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

    openOrderModal();

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
    cy.get("[data-cy=text-DBC-bibilioteksekspressen]").click();
    cy.get('[data-cy="text-vsn-b.adresse"]')
      .scrollIntoView()
      .should("be.visible");

    // Type email
    cy.get("#order-user-email").type("freja@dbc.dk");

    // updating loanerinfo in background
    cy.get("[data-cy=text-freja-damgaard]").click();
    cy.wait(1000);

    // submit order
    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitOrder").then((order) => {
      expect(order.request.body.variables.input).to.deep.equal({
        pickUpBranch: "790903",
        userParameters: {
          userMail: "freja@dbc.dk",
          userName: "Freja Damgaard",
        },
        pids: ["870970-basis:51701763", "870970-basis:12345678"], // all pids for selected materialtype (bog)
      });
    });

    cy.contains("Bestillingen blev gennemført");
  });

  it("should not tab to order modal after it is closed", () => {
    cy.visit(
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763`
    );

    cy.get("[data-cy=button-nej-tak]").click();
    openOrderModal();
    cy.wait(500);
    cy.get("[data-cy=close-modal]").click();
    cy.tab();
    cy.get("[data-cy=modal-container] *:focused").should("not.exist");
  });

  it("should show modal when a deep link is followed", () => {
    cy.visit(
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763?order=870970-basis%3A51701763&modal=order`
    );
    cy.url().should("include", "modal=order");
  });

  it("should handle failed checkorder and pickupAllowed=false", () => {
    cy.visit("/iframe.html?id=modal-order--order-policy-fail&viewMode=story");
    cy.contains(
      "Materialet kan ikke bestilles til det her afhentningssted. Vælg et andet."
    );

    cy.get("[data-cy=button-godkend]").should("be.disabled");

    cy.get("[data-cy=text-vælg-afhentning]").click();

    cy.get("[data-cy=list-branches] [data-cy=list-button-0]").should(
      "have.attr",
      "aria-disabled",
      "false"
    );
    cy.get("[data-cy=list-branches] [data-cy=list-button-1]").should(
      "have.attr",
      "aria-disabled",
      "false"
    );
    cy.get("[data-cy=list-branches] [data-cy=list-button-2]").should(
      "have.attr",
      "aria-disabled",
      "true"
    );
  });
});

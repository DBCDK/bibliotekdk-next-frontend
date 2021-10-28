/**
 * @file
 * Test functionality of Order modal
 */

import merge from "lodash/merge";

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

function mockLogin(customMock = {}) {
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
        req.reply(merge({}, fixture, customMock));
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

function mockBranchUserParameters() {
  cy.fixture("branchUserParameters.json").then((fixture) => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("BranchUserParameters(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockBranchesSearch() {
  cy.fixture("branches.json").then((fixture) => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("branches(q:")) {
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

function mockSessionUserParameters() {
  cy.fixture("sessionUserParametersNull.json").then((fixtureNull) => {
    cy.fixture("sessionUserParameters.json").then((fixture) => {
      cy.intercept("POST", "/graphql", (req) => {
        if (req.body.query.includes("session {")) {
          cy.returnUserParameters ? req.reply(fixture) : req.reply(fixtureNull);
        }
      });
    });
  });
}

function mockSubmitSessionUserParameters() {
  cy.fixture("submitSessionUserParameters.json").then((fixture) => {
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("submitSession")) {
        req.reply(fixture);
      }
    });
  });
}

function openOrderModal() {
  // Wait for content to be loaded
  cy.get("[data-cy=button-order-overview-enabled]");
  cy.wait(1000);

  // Open order modal
  cy.get("[data-cy=button-order-overview-enabled]").click();
}

describe("Order", () => {
  beforeEach(function () {
    mockFullWork();
    mockAvailability();
    mockSubmitOrder();

    // manipulating the user mock for this specific test
    const customMock = {
      data: {
        user: {
          mail: "cicero@mail.dk",
        },
      },
    };

    mockLogin(customMock);
  });

  it("submits order - happy path", () => {
    cy.visit(
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763`
    );

    openOrderModal();
    mockSubmitSessionUserParameters();
    mockSessionUserParameters();

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
    cy.get("[data-cy=text-skift-afhentning]").click();
    cy.get("[data-cy=text-DBC-bibilioteksekspressen]").click();
    cy.get('[data-cy="text-b.-adresse"]').scrollIntoView().should("be.visible");

    // cicero mail should default be inserted and locked here
    cy.get("#order-user-email").should("have.value", "cicero@mail.dk");
    cy.get("#order-user-email").should("be.disabled");

    // updating loanerinfo in background
    cy.get("[data-cy=text-freja-damgaard]").click();

    // submit order
    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitOrder").then((order) => {
      console.log(order.request.body.variables.input, "INPUT");
      expect(order.request.body.variables.input).to.deep.equal({
        pids: ["870970-basis:51701763", "870970-basis:12345678"], // all pids for selected materialtype (bog)
        pickUpBranch: "790900",
        userParameters: {
          userMail: "cicero@mail.dk",
          userName: "Freja Damgaard",
        },
      });
    });

    cy.contains("Bestillingen blev gennemført");
  });

  it("Should not lock emailfield for agencies with no borrowerCheck", () => {
    cy.returnUserParameters = false;
    // Custom mock
    mockBranchesSearch();
    mockBranchUserParameters();
    mockSubmitSessionUserParameters();
    mockSessionUserParameters();

    cy.visit(
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763`
    );

    openOrderModal();

    // Work info in modal is visible
    cy.get('[data-cy="text-hest,-hest,-tiger,-tiger"]').should("be.visible");

    // cicero mail should default be inserted here
    cy.get("#order-user-email").should("have.value", "cicero@mail.dk");
    cy.get("#order-user-email").should("be.disabled");
    // Change pickup branch
    cy.get("[data-cy=text-skift-afhentning]").click();

    cy.get("[data-cy=pickup-search-input]").type("BranchWithNoBorchk");
    cy.wait(1000);
    cy.tab().type("{enter}");

    cy.get("[data-cy=input-customId]").type("Some class");
    cy.get("[data-cy=input-userName]").should("have.value", "Freja Damgaard");

    // cicero mail should default be inserted here
    cy.get("[data-cy=input-userMail]").should("have.value", "cicero@mail.dk");

    // user is allowed to enter an alternative mail
    cy.get("[data-cy=input-userMail]").clear();
    cy.get("[data-cy=input-userMail]").type("freja@mail.dk");

    // Intercept fetching user params, and return actual parameters
    cy.wait(100).then(() => {
      cy.returnUserParameters = true;
    });

    cy.get("[data-cy=button-log-ind]").click();

    // cicero mail should now be replaced with the alternative mail
    cy.get("#order-user-email").should("have.value", "freja@mail.dk");
    cy.get("#order-user-email").should("not.be.disabled");

    // submit order
    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitOrder").then((order) => {
      console.log(order.request.body.variables.input, "INPUT");
      expect(order.request.body.variables.input).to.deep.equal({
        pids: ["870970-basis:51701763", "870970-basis:12345678"], // all pids for selected materialtype (bog)
        pickUpBranch: "790904",
        userParameters: {
          userMail: "freja@mail.dk",
          userName: "Freja Damgaard",
          customId: "Some class",
        },
      });
    });
  });

  it("should not tab to order modal after it is closed", () => {
    cy.visit(
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763`
    );

    cy.get("[data-cy=button-nej-tak]").click();
    openOrderModal();
    cy.wait(500);
    cy.get("[data-cy=close-modal]").click();
    cy.get("body").tab();
    cy.get("[data-cy=modal-dimmer]").should("not.be.visible");
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
    cy.get("[data-cy=text-skift-afhentning]").click();
  });
});

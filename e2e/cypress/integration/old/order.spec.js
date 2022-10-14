/**
 * @file
 * Test functionality of Order modal
 */

import merge from "lodash/merge";

const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const graphqlPath = Cypress.env("graphqlPath");

function mockLogin(customMock = {}) {
  cy.intercept("/api/auth/session", {
    body: {
      user: {
        uniqueId: "3ad8276b-43ed-430e-891d-3238996da656",
      },
      expires: "2021-06-26T07:00:09.408Z",
      accessToken: "dummy-token",
    },
  });
  cy.fixture("user.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("user {")) {
        req.reply(merge({}, fixture, customMock));
      }
    });
  });
}

function mockFullWork() {
  cy.fixture("fullwork.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("work(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockArticleWork() {
  cy.fixture("fullarticlework.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("work(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockArticleWorkNoPhysical() {
  cy.fixture("fullarticleworknophysical.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("work(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockPeriodicaWork() {
  cy.fixture("fullperiodicawork.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("work(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockAvailability() {
  cy.fixture("fullmanifestation.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("manifestation(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockBranchUserParameters() {
  cy.fixture("branchUserParameters.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("BranchUserParameters(")) {
        req.reply(fixture);
      }
    });
  });
}

function mockBranchesSearch() {
  cy.fixture("branches.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("branches(q:")) {
        console.log(fixture);
        req.reply(fixture);
      }
    });
  });
}

function mockSubmitOrder() {
  cy.fixture("submitorder.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("submitOrder(")) {
        req.reply(fixture);
        req.alias = "submitOrder";
      }
    });
  });
}

function mockSubmitPeriodicaArticleOrder() {
  cy.fixture("submitPeriodicaArticleOrder.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("submitPeriodicaArticleOrder(")) {
        req.reply(fixture);
        req.alias = "submitPeriodicaArticleOrder";
      }
    });
  });
}

function mockSessionUserParameters() {
  cy.fixture("sessionUserParametersNull.json").then((fixtureNull) => {
    cy.fixture("sessionUserParameters.json").then((fixture) => {
      cy.intercept("POST", `${graphqlPath}`, (req) => {
        if (req.body.query.includes("session {")) {
          cy.returnUserParameters ? req.reply(fixture) : req.reply(fixtureNull);
        }
      });
    });
  });
}

function mockSubmitSessionUserParameters() {
  cy.fixture("submitSessionUserParameters.json").then((fixture) => {
    cy.intercept("POST", `${graphqlPath}`, (req) => {
      if (req.body.query.includes("submitSession")) {
        req.reply(fixture);
      }
    });
  });
}

function mockFallback() {
  cy.intercept("/190101/bibdk21/graphql", (req) => {
    req.reply({ message: "fallback response" });
  });
}

function openOrderModal() {
  cy.wait(1000);
  // Wait for content to be loaded
  cy.get("[data-cy=button-order-overview-enabled]");
  cy.wait(1000);

  // Open order modal
  cy.get("[data-cy=button-order-overview-enabled]").click();
}

describe("Order", () => {
  beforeEach(function () {
    mockFallback();
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
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763?disablePagePropsSession=true`
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
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763?disablePagePropsSession=true`
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

    // email should be validated
    cy.get("[data-cy=input-userMail]").type("fiskehest");
    cy.get("[data-cy=button-log-ind]").click();

    cy.get("[data-cy=text-angiv-venligst-en-korrekt-email-adresse]").contains(
      "Angiv venligst en korrekt email-adresse"
    );

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
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763?disablePagePropsSession=true`
    );

    cy.get("[data-cy=button-nej-tak]").click();
    openOrderModal();
    cy.wait(1000);
    cy.get("[data-cy=close-modal]").click();
    cy.wait(1000);
    cy.get("body").tab();
    cy.get("[data-cy=modal-dimmer]").should("not.be.visible");
  });

  it("should show modal when a deep link is followed", () => {
    cy.visit(
      `${nextjsBaseUrl}/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763?disablePagePropsSession=true&order=870970-basis%3A51701763&modal=order`
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

describe("Order periodica article", () => {
  beforeEach(function () {
    mockAvailability();
    mockSubmitOrder();
    mockSubmitPeriodicaArticleOrder();
  });

  it("should order indexed periodica article as digital copy", () => {
    mockArticleWork();
    mockLogin({
      data: {
        user: {
          mail: "cicero@mail.dk",
        },
      },
    });
    cy.visit(
      `${nextjsBaseUrl}/materiale/bo-bedre-paa-din-krops-betingelser_charlotte-hallbaeck-andersen/work-of%3A870971-tsart%3A33261853?disablePagePropsSession=true`
    );

    cy.wait(3000);

    openOrderModal();

    cy.get(".modal_container [data-cy=text-digital-kopi]").should("be.visible");
    cy.contains("Dit bibliotek");
    cy.get(".modal_container [data-cy=text-digital-kopi]")
      .scrollIntoView()
      .should("be.visible");

    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitPeriodicaArticleOrder").then((order) => {
      console.log(order.request.body.variables.input, "INPUT");
      expect(order.request.body.variables.input).to.deep.equal({
        pid: "870971-tsart:33261853",
        pickUpBranch: "790900",
        userName: "Freja Damgaard",
        userMail: "cicero@mail.dk",
      });
    });

    cy.contains("Du vil modtage en email fra Det Kgl. Bibliotek med artiklen");
  });

  it("should order indexed periodica article as physical copy", () => {
    mockArticleWork();
    mockLogin({
      data: {
        user: {
          mail: "cicero@mail.dk",
          agency: {
            result: [
              {
                digitalCopyAccess: false,
              },
            ],
          },
        },
      },
    });
    cy.visit(
      `${nextjsBaseUrl}/materiale/bo-bedre-paa-din-krops-betingelser_charlotte-hallbaeck-andersen/work-of%3A870971-tsart%3A33261853?disablePagePropsSession=true`
    );

    openOrderModal();

    // Check that text match a physical order
    cy.contains("Afhentningssted");
    cy.contains(
      "Du får besked fra dit bibliotek når materialet er klar til afhentning"
    );

    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitOrder").then((order) => {
      console.log(order.request.body.variables.input, "INPUT");
      expect(order.request.body.variables.input).to.deep.equal({
        pids: ["870971-tsart:33261853"],
        pickUpBranch: "790900",
        userParameters: {
          userMail: "cicero@mail.dk",
          userName: "Freja Damgaard",
        },
      });
    });

    cy.contains("Bestillingen blev gennemført");
  });

  it("should not order indexed periodica article as physical copy when not available as physical copy", () => {
    mockArticleWorkNoPhysical();
    mockLogin({
      data: {
        user: {
          mail: "cicero@mail.dk",
          agency: {
            result: [
              {
                digitalCopyAccess: false,
              },
            ],
          },
        },
      },
    });
    cy.visit(
      `${nextjsBaseUrl}/materiale/bo-bedre-paa-din-krops-betingelser_charlotte-hallbaeck-andersen/work-of%3A870971-tsart%3A33261853?disablePagePropsSession=true`
    );

    openOrderModal();

    cy.contains(
      "Materialet kan ikke bestilles til det her afhentningssted. Vælg et andet."
    );

    cy.get("[data-cy=button-godkend]").should("be.disabled");
  });
});

describe("Order periodica volume", () => {
  beforeEach(function () {
    mockPeriodicaWork();
    mockAvailability();
    mockSubmitOrder();
    mockSubmitPeriodicaArticleOrder();
  });

  it("should order full physical periodica volume", () => {
    mockLogin({
      data: {
        user: {
          mail: "cicero@mail.dk",
          agency: {
            result: [
              {
                digitalCopyAccess: true,
              },
            ],
          },
        },
      },
    });
    cy.visit(
      `${nextjsBaseUrl}/materiale/siden-saxo_/work-of%3A870970-basis%3A06150179?disablePagePropsSession=true`
    );

    openOrderModal();

    // Try to order without filling out form
    cy.get("[data-cy=button-godkend]").click();

    cy.contains("For at bestille skal du vælge udgave eller artikel");

    cy.get('[data-cy="text-vælg-udgave-eller-artikel"]').click();

    cy.get('[placeholder="Skriv årstal"]').type("1992");

    cy.get('[placeholder="Hæfte, nummer eller bind"]').type("8");

    cy.get('[data-cy="button-gem"]').click();

    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitOrder").then((order) => {
      console.log(order.request.body.variables.input, "INPUT");
      expect(order.request.body.variables.input).to.deep.equal({
        pids: ["870970-basis:06150179"],
        pickUpBranch: "790900",
        userParameters: {
          userMail: "cicero@mail.dk",
          userName: "Freja Damgaard",
        },
        publicationDateOfComponent: "1992",
        volume: "8",
      });
    });
  });

  it("should order physical non-indexed article from periodica volume", () => {
    mockLogin({
      data: {
        user: {
          mail: "cicero@mail.dk",
          agency: {
            result: [
              {
                digitalCopyAccess: false,
              },
            ],
          },
        },
      },
    });
    cy.visit(
      `${nextjsBaseUrl}/materiale/siden-saxo_/work-of%3A870970-basis%3A06150179?disablePagePropsSession=true`
    );

    openOrderModal();

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

    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitOrder").then((order) => {
      console.log(order.request.body.variables.input, "INPUT");
      expect(order.request.body.variables.input).to.deep.equal({
        pids: ["870970-basis:06150179"],
        pickUpBranch: "790900",
        userParameters: {
          userMail: "cicero@mail.dk",
          userName: "Freja Damgaard",
        },
        publicationDateOfComponent: "1992",
        volume: "8",
        authorOfComponent: "Test Testesen",
        titleOfComponent: "some title",
        pagination: "100-104",
      });
    });
  });

  it("should order non-indexed article from periodica volume as digital copy", () => {
    mockLogin({
      data: {
        user: {
          mail: "cicero@mail.dk",
          agency: {
            result: [
              {
                digitalCopyAccess: true,
              },
            ],
          },
        },
      },
    });
    cy.visit(
      `${nextjsBaseUrl}/materiale/siden-saxo_/work-of%3A870970-basis%3A06150179?disablePagePropsSession=true`
    );

    openOrderModal();

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

    cy.get("[data-cy=button-godkend]").click();

    cy.wait("@submitPeriodicaArticleOrder").then((order) => {
      console.log(order.request.body.variables.input, "INPUT");
      expect(order.request.body.variables.input).to.deep.equal({
        pid: "870970-basis:06150179",
        pickUpBranch: "790900",
        userName: "Freja Damgaard",
        userMail: "cicero@mail.dk",
        publicationDateOfComponent: "1992",
        volume: "8",
        authorOfComponent: "Test Testesen",
        titleOfComponent: "some title",
        pagination: "100-104",
      });
    });
  });
});

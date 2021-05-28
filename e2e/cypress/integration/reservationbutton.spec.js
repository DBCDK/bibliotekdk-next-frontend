/**
 * @file
 * Test functionality of reservation button - see also @overview.spec.js
 */
describe("Reservation button", () => {
  beforeEach(() => {
    // Intercept requests to graphql
    cy.intercept("POST", "/graphql", (req) => {
      if (req.body.query.includes("manifestation")) {
        // mock the suggest response
        if (req.body.query.includes("availability")) {
          req.alias = "apiMutation";
          req.reply({
            data: {
              manifestation: {
                materialType: "Bog",
                availability: {
                  orderPossible: true,
                  orderPossibleReason: "not_owned_ILL_loc",
                  willLend: true,
                  expectedDelivery: "",
                },
              },
            },
            monitor: "OK",
          });
        }
      }
    });

    cy.visit("/iframe.html?id=work-overview--reservation-button-active");
  });

  it.skip(`user logged in material available`, () => {
    cy.get("[data-cy=button-order-overview]")
      .contains("Bestil")
      .click({ force: true });

    cy.get("[data-cy=button-order-overview]").contains("Bestil").click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("order");
    });
  });

  it(`user logged in material unavailable`, () => {
    cy.intercept("/graphql", (req) => {
      if (req.body.query.includes("manifestation")) {
        console.log("INTERCEPTED");
        // mock the suggest response
        if (req.body.query.includes("availability")) {
          req.reply({
            data: {
              manifestation: {
                materialType: "Bog",
                availability: {
                  orderPossible: false,
                  orderPossibleReason: "not_owned_ILL_loc",
                  willLend: false,
                  expectedDelivery: "",
                },
              },
            },
            monitor: "OK",
          });
        }
      }
    });
    cy.visit("/iframe.html?id=work-overview--reservation-button-active");
    cy.get("[data-cy=button-order-overview]").should("be.disabled");
  });
});

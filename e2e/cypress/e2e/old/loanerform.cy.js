/**
 * @file
 * Test functionality of loanerform
 */
describe("LoanerForm", () => {
  it("All elements are shown", () => {
    //check if form contains test "balbla"
    cy.visit("/iframe.html?id=modal-loanerform--show-loaner-form");

    cy.contains("h3", "Log ind").should("exist");

    cy.get("form").within(() => {
      // Check if info-text is shown inside of form
      cy.contains(
        "p",
        "Du skal bruge dine låneroplysninger fra DBC-Testbiblioteksvæsen"
      ).should("exist");
    });

    //test if all input fields are shown
    cy.get("[data-cy]").then((elements) => {
      // Filter elements that end with "label"
      const elementsWithLabel = elements.filter((index, element) => {
        const dataCyValue = Cypress.$(element).attr("data-cy");
        return dataCyValue && dataCyValue.startsWith("input-");
      });
      // Get the count of input fields
      const count = elementsWithLabel.length;
      cy.expect(count).to.be.equal(11);
    });

    //additional information for pincode field is shown
    cy.contains("Pinkode/brugerkode. Den du bruger på biblioteket").should(
      "be.visible"
    );

    //info text is shown
    cy.contains(
      "DBC-Testbiblioteksvæsen understøtter pt. kun gæstelogin, hvilket betyder at dine oplysninger gemmes i sessionen indtil du trykker log ud eller lukker browseren"
    ).should("be.visible");
  });

  it("Validation works", () => {
    cy.visit("/iframe.html?id=modal-loanerform--show-loaner-form-2");

    //error if not all fields have been filled out
    cy.get("[data-cy=input-userMail]").should("be.visible").type("Bernd");
    cy.get("[data-cy=button-log-ind]").should("be.visible").click();
    cy.get("[data-cy=text-udfyld-venligst-alle-felter]").should("be.visible");
    //error if email is not valid
    cy.get("[data-cy=input-userId]").should("be.visible").type("123");
    cy.get("[data-cy=input-userName]").should("be.visible").type("Bernd");
    cy.get("[data-cy=button-log-ind]").should("be.visible").click();
    cy.get("[data-cy=text-angiv-venligst-en-korrekt-email-adresse]").should(
      "be.visible"
    );
    //no error if all fields have been filled out and email adress correct
    cy.get("[data-cy=input-userMail]").should("be.visible").type("@test.dk");
    cy.get("[data-cy=button-log-ind]").should("be.visible").click();
    cy.get("[data-cy=text-angiv-venligst-en-korrekt-email-adresse]").should(
      "not.exist"
    );
    cy.get("[data-cy=text-udfyld-venligst-alle-felter]").should("not.exist");
  });
});

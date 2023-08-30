/**
 * @file
 * Test functionality of loanerform
 */
describe("LoanerForm", () => {
  it("All elements are shown", () => {
    //check if form contains test "balbla"
    cy.visit("/iframe.html?id=modal-loanerform--show-loaner-form-all-fields");

    cy.contains("h3", "Bestil til DBCTestBibliotek").should("exist");

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
  });

  it("Validation works in form with email required", () => {
    cy.visit("/iframe.html?id=modal-loanerform--show-loaner-form-short");

    //error if not all fields have been filled out
    cy.get("[data-cy=input-userMail]").should("be.visible").type("Bernd");
    cy.get("[data-cy=button-gå-til-bestilling]").should("be.visible").click();
    cy.get("[data-cy=text-udfyld-venligst-alle-felter]").should("be.visible");
    //error if email is not valid
    cy.get("[data-cy=input-userId]").should("be.visible").type("123");
    cy.get("[data-cy=input-userName]").should("be.visible").type("Bernd");
    cy.get("[data-cy=button-gå-til-bestilling]").should("be.visible").click();
    cy.get("[data-cy=text-angiv-venligst-en-korrekt-email-adresse]").should(
      "be.visible"
    );
    //no error if all fields have been filled out and email adress correct
    cy.get("[data-cy=input-userMail]").should("be.visible").type("@test.dk");
    cy.get("[data-cy=button-gå-til-bestilling]").should("be.visible").click();
    cy.get("[data-cy=text-angiv-venligst-en-korrekt-email-adresse]").should(
      "not.exist"
    );
    cy.get("[data-cy=text-udfyld-venligst-alle-felter]").should("not.exist");
  });

  it("Validation works in form without email field", () => {
    cy.visit(
      "/iframe.html?id=modal-loanerform--show-loaner-form-short-no-mail"
    );

    //error if not all fields have been filled out
    cy.get("[data-cy=input-userAddress]")
      .should("be.visible")
      .type("Tempovej 7 - 10");
    cy.get("[data-cy=button-gå-til-bestilling]").should("be.visible").click();
    cy.get("[data-cy=text-udfyld-venligst-alle-felter]").should("be.visible");
    //no error if all fields have been filled out
    cy.get("[data-cy=input-userId]").should("be.visible").type("123");
    cy.get("[data-cy=input-userName]").should("be.visible").type("Bernd");
    cy.get("[data-cy=button-gå-til-bestilling]").should("be.visible").click();
    cy.get("[data-cy=text-udfyld-venligst-alle-felter]").should("not.exist");
    //no error about missing mail
    cy.get("[data-cy=text-angiv-venligst-en-korrekt-email-adresse]").should(
      "not.exist"
    );
  });

  it("Checkbox working", () => {
    cy.visit("/iframe.html?id=modal-loanerform--show-loaner-form-short");

    //we have checkbox
    cy.get("[data-cy=checkbox]").should("not.be.checked");
    //we have checkbox label
    cy.get("[id=loanerform-checkbox-label]").should(
      "contain",
      "Gem informationer til næste bestilling"
    );
    //we we have popover
    cy.get("[data-cy=popover-container]").should("not.exist");
    cy.get("[data-cy=tooltip-icon]")
      .should("have.css", "cursor", "pointer")
      .click();
    cy.get("[data-cy=popover-container]").should("be.visible");
  });
});

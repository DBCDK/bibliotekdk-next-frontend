/**
 * @file
 * Test functionality of loanerform
 */
describe("LoanerForm", () => {
  it(`Digital copy`, () => {
    cy.visit(
      "/iframe.html?id=modal-order-loanerform--show-loaner-form-digital-access"
    );

    cy.get(
      "[data-cy=text-du-vil-få-artiklen-tilsendt-som-digital-kopi-på-mail]"
    ).contains("Du vil få artiklen tilsendt som digital kopi på mail");
  });
});

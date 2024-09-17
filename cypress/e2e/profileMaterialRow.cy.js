describe("Material rows - loans and debt", () => {
  /*
   * NOTICE this test is written to ensure story book is working as expected
   * @TODO - some real tests
   * */
  it(`Story book works as expected`, () => {
    cy.visit("/iframe.html?id=profile-materialrow--material-row-story");
    cy.contains("Material Row - Loan").should("exist");
  });
});

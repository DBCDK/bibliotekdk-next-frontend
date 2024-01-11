describe("Libraries Table in profile", () => {
  /*
   * NOTICE this test is written to ensure story book is working as expected
   * @TODO - some real tests
   * */
  it(`Story book works as expected`, () => {
    cy.visit("/iframe.html?id=profile-librariestable--libraries-table-story");
    cy.contains("Silkeborg Biblioteker").should("exist");
  });
});

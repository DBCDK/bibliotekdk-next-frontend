describe("Error row in profile", () => {
  /*
   * NOTICE this test is written to ensure story book is working as expected
   * @TODO - some real tests
   * */
  it(`Story book works as expected`, () => {
    cy.visit("/iframe.html?id=profile-errorrow--error-row-story");
    cy.contains(
      "Noget gik galt, da reserveringen skulle slettes. Prøv igen"
    ).should("exist");
  });
});

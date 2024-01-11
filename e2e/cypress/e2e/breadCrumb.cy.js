describe("Breadcrumb", () => {
  /*
   * NOTICE this test is written to ensure story book is working as expected
   * @TODO - some real tests
   * */
  it(`Story book works as expected`, () => {
    cy.visit("/iframe.html?id=profile-breadcrumb--breadcrumb-story");
    cy.contains("Profil").should("exist");
  });
});

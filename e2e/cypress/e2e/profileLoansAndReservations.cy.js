describe("Libraries Table in profile", () => {
  /*
   * NOTICE this test is written to ensure story book is working as expected
   * @TODO - some real tests
   * */
  it(`Story book works as expected`, () => {
    cy.visit(
      "/iframe.html?id=profile-loans-and-reservations--loans-and-reservations-story"
    );
    cy.contains("Du ser lån og reserveringer for dine biblioteker").should(
      "exist"
    );
  });
});

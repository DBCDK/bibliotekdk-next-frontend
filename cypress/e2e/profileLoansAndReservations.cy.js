describe("Loans and reservations in profile", () => {
  /*
   * NOTICE this test is written to ensure story book is working as expected
   * @TODO - some real tests
   * */
  it(`Story book works as expected`, () => {
    cy.visit(
      "/iframe.html?id=profile-loans-and-reservations--loans-and-reservations-story"
    );
    cy.contains(
      "Her har du et overblik over dine aktuelle lån og reservationer."
    ).should("exist");
  });
});

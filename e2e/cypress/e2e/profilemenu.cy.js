describe("Profilemenu", () => {
  it(`Single Edition with year, publisher, ordertext`, () => {
    cy.visit("/iframe.html?id=profile-profilemenu--profile-menu-story");

    cy.get('[data-cy="group-menu-loansAndReservations"]').then((el) => {
      expect(el).to.exist;
    });
    cy.get('[data-cy="group-menu-loansAndReservations"]').click();
    // count how many children there are
    //click on children
    // check href
    // there should be additional text for specific edition
  });
});

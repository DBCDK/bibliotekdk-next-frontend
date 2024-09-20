describe("ProfileLayout", () => {
  it(`User logged in without uniqueId should not see profile`, () => {
    cy.visit(
      "/iframe.html?id=profile-layout--profile-layout-no-unique-id&viewMode=story"
    );

    cy.contains("Du er logget ind");

    cy.contains("Lån og reserveringer").should("not.exist");

    cy.contains("Log venligst ind for at se din profil").should("not.exist");
  });

  it(`User with uniqueId can visit profile page`, () => {
    cy.visit(
      "/iframe.html?id=profile-layout--profile-layout-with-unique-id&viewMode=story"
    );

    cy.contains("Du er logget ind");

    cy.contains("Lån og reserveringer");

    cy.contains("Log venligst ind for at se din profil").should("not.exist");
  });
});

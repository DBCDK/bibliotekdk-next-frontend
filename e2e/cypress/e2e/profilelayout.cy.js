describe("ProfileLayout", () => {
  it(`User logged in without uniqueId must be sent to frontpage`, () => {
    cy.visit(
      "/iframe.html?id=profile-layout--profile-layout-no-unique-id&viewMode=story"
    );

    // Wait for potential redirect
    cy.wait(500);

    cy.get("[data-cy=router-pathname]").should("have.text", "/");
    cy.get("[data-cy=router-action]").should("have.text", "replace");
  });
  it(`User logged in without uniqueId can visit huskeliste without being redirected`, () => {
    cy.visit(
      "/iframe.html?id=profile-layout--profile-layout-no-unique-id&viewMode=story"
    );

    cy.contains("huskeliste").click();

    // Wait for potential redirect
    cy.wait(500);

    cy.get("[data-cy=router-pathname]").should(
      "have.text",
      "/profil/huskeliste"
    );
  });
  it(`User with uniqueId can visit profile page without being redirected`, () => {
    cy.visit(
      "/iframe.html?id=profile-layout--profile-layout-with-unique-id&viewMode=story"
    );

    // Wait for potential redirect
    cy.wait(500);

    cy.get("[data-cy=router-pathname]").should(
      "have.text",
      "/profil/laan-og-reserveringer"
    );
  });
});

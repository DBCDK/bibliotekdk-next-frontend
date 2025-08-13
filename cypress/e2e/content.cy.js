const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

describe("Content", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit(
      `${nextjsBaseUrl}/materiale/tales-from-the-north_per-noergaard-f-1932-/work-of:870970-basis:27634427`
    );
    cy.consentAllowAll();
    cy.get("[data-cy=anchor-menu-items]").invoke("css", "display", "none");
    cy.get("[data-cy=feedback-wrapper]").invoke("css", "display", "none");

    cy.contains("Seneste udgave, musik");
  });

  it(`Section with content is correctly rendered - Desktop`, () => {
    cy.contains("version for 10")
      .parents('[data-cy="section"]')
      .matchImageSnapshot({
        maxDiffThreshold: 0.00001,
      });
  });

  it(`Section with content is correctly rendered - Mobile`, () => {
    cy.viewport(375, 812);

    cy.contains("version for 10")
      .parents('[data-cy="section"]')
      .matchImageSnapshot({
        maxDiffThreshold: 0.00001,
      });
  });

  it(`Modal with full content is correctly rendered`, () => {
    cy.wait(1000);
    cy.contains("version for 10")
      .parents('[data-cy="section"]')
      .contains("Se alle")
      .click();
    cy.wait(1000);

    cy.get(".modal_container").matchImageSnapshot({
      maxDiffThreshold: 0.00001,
    });
  });
});

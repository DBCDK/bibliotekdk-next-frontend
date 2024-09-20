const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
describe("redirect to work page", () => {
  it("should redirect /work/work-of:[pid]", () => {
    cy.visit(`${nextjsBaseUrl}/work/work-of:870970-basis:22629344`);

    cy.on("url:change", (url) => {
      expect(url).to.contain("materiale");
    });
  });
  it("should redirect /work/[pid]", () => {
    cy.visit(`${nextjsBaseUrl}/work/870970-basis:22629344`);

    cy.on("url:change", (url) => {
      expect(url).to.contain("materiale");
    });
  });
});

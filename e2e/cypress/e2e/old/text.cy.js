/**
 * @file
 * Test functionality of Text
 */
describe("Text", () => {
  it(`Can clamp lines`, async () => {
    await cy.visit("/iframe.html?id=base-texts--line-clamping");
    cy.get("p")
      .last()
      .should("have.css", "-webkit-line-clamp", "2")
      .and("have.css", "overflow", "hidden");
  });
});

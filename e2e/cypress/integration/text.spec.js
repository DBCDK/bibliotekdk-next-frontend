/**
 * @file
 * Test functionality of Text
 */
describe("Text", () => {
  it(`Can clamp lines`, () => {
    cy.visit("/iframe.html?id=base-texts--line-clamping");
    cy.get("p")
      .last()
      .should("have.css", "max-height", "78px")
      .and("have.css", "-webkit-line-clamp", "3")
      .and("have.css", "overflow", "hidden");
  });
});

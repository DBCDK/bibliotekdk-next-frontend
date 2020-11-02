/**
 * @file
 * Test functionality of bibliographic data
 */
describe.skip("Keywords", () => {
  before(function () {
    cy.visit("/iframe.html?id=work-bibliographic-data--bib-data");
  });

  it(`get column1`, () => {
    // check bibliotgraphic-columns - there should be 3 bibliographic-column1,
    // bibliographic-column2, bibliographic-column3
    const columns = cy.get("[data-cy^=bibliographic-column]");
    columns.should("have.length", 3);
  });

  it("check column 0ne", () => {
    const column1 = cy.get("[data-cy=bibliographic-column1]");
    // there should be 5 elements in column1 [image,link,link,link.button]
    column1.children().should("have.length", 5);
    // first element is an image - img is wrapped in a div - use find
    column1.find("img").should("have.length", "1");
    // there shoul be 3 links
    column1.get("a").should("have.length", "3");
    // and fineally a button
    column1.get("button").should("have.length", "1");
  });
});

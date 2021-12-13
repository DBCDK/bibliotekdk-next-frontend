/**
 * @file
 * Test functionality modal options for article access
 */
describe("Overview", () => {
  before(function () {
    cy.visit("/iframe.html?id=modal-options--all-options");
  });

  it(`All option links present`, () => {
    cy.get("body").tab();
    cy.tab();
    cy.focused().should(
      "have.attr",
      "href",
      "https://videnskab.dk/forskerzonen/kultur-samfund/saadan-goer-du-din-ferie-mere-baeredygtig"
    );

    cy.tab();
    cy.focused().should(
      "have.attr",
      "href",
      "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=36160780&attachment_type=856_a&bibliotek=870971&source_id=870970&key=68d322934a78818989ce"
    );
    cy.tab();
    cy.focused().should(
      "have.attr",
      "href",
      "/infomedia/fiske_hest/work-of:870971-tsart:39160846"
    );
  });
});

/**
 * @file
 * Test feedback for search results
 */
const MINE_SHAFT_RGB = "rgb(33, 33, 33)";
const BLUE_RGB = "rgb(51, 51, 255)";
const WHITE_RGB = "rgb(255, 255, 255)";
const TRANSPARENT_RGB = "rgba(0, 0, 0, 0)";

function thumbButton(dataCy) {
  return cy.get(`[data-cy=${dataCy}]`).parent();
}

function thumbPath(dataCy) {
  return cy.get(`[data-cy=${dataCy}]`).find("path").first();
}

function assertThumbStyles(dataCy, { backgroundColor, fill }) {
  thumbButton(dataCy).should("have.css", "background-color", backgroundColor);
  thumbPath(dataCy).should(($path) => {
    expect(window.getComputedStyle($path[0]).fill, `${dataCy} icon fill`).to.eq(
      fill,
    );
  });
}

describe("searchfeedback", () => {
  it(`thumb styling in default, hover and active states`, () => {
    cy.visit("/iframe.html?id=base-searchfeedback--feed-back");

    ["search-feedback-thumbsup", "search-feedback-thumbsdown"].forEach(
      (dataCy) => {
        assertThumbStyles(dataCy, {
          backgroundColor: TRANSPARENT_RGB,
          fill: MINE_SHAFT_RGB,
        });

        thumbButton(dataCy).focus();
        assertThumbStyles(dataCy, {
          backgroundColor: BLUE_RGB,
          fill: WHITE_RGB,
        });

        thumbButton(dataCy).trigger("mousedown");
        assertThumbStyles(dataCy, {
          backgroundColor: BLUE_RGB,
          fill: WHITE_RGB,
        });

        thumbButton(dataCy).trigger("mouseup").blur();
      },
    );
  });

  it(`thumbsup click`, () => {
    cy.visit("/iframe.html?id=base-searchfeedback--feed-back");
    // verify that banner is shown
    cy.get("[data-cy=search-feedback-thumbsup]").should("be.visible");
    cy.get("[data-cy=search_feed_back_thankyou]").should("not.to.exist");
    cy.get("[data-cy=search-feedback-thumbsup]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.contain("up");
    });
    cy.get("[data-cy=search_feed_back_thankyou]").should("be.visible");
    cy.wait(3000);
    cy.get("[data-cy=search_feed_back_thankyou]").should("not.be.visible");
  });

  it(`thumbsdown click`, () => {
    cy.visit("/iframe.html?id=base-searchfeedback--feed-back");
    // verify that banner is shown
    cy.get("[data-cy=search-feedback-thumbsdown]").should("be.visible");

    cy.get("[data-cy=search-feedback-form]").should("not.to.exist");

    cy.get("[data-cy=search-feedback-thumbsdown]").click();

    cy.get("[data-cy=search-feedback-form]").should("be.visible");

    cy.get("[data-cy=search-feedback-input]").type("fisk");

    cy.get("[data-cy=search-feedback-form] Button").click();
    cy.on("window:alert", (str) => {
      expect(str).to.contain("fisk");
    });
  });
});

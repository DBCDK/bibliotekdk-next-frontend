function assertCurrentLeftScroll(current, comparable) {
  expect(current).not.to.be.greaterThan(
    comparable,
    `Expected element scroll to be less than or equal to ${comparable} but was ${current}`
  );
  console.log("current: ", current);
}

function appendCurrentLeftScrollToArray($el, arrayOfScrolls) {
  arrayOfScrolls.push($el.scrollLeft());
  assertCurrentLeftScroll(arrayOfScrolls.at(-1), arrayOfScrolls.at(-2));
}

describe("Related works", () => {
  it("desktop", () => {
    cy.visit("/iframe.html?id=work-relatedworks--related-works-physical-book");

    cy.viewport(1920, 1080);

    let leftScroll = [0];
    function appendCurrentLeftScrollToArrayInner($el) {
      appendCurrentLeftScrollToArray($el, leftScroll);
    }

    cy.get("#relatedWorks_slide")
      .should("exist")
      .should(appendCurrentLeftScrollToArrayInner);

    cy.contains("Hugo i Sølvskoven 2");
    cy.contains("Hugo i Sølvskoven 3");

    // First scroll
    cy.get("[data-cy=right_arrow]", { timeout: 10000 }).click();

    cy.get("#relatedWorks_slide").should(appendCurrentLeftScrollToArrayInner);

    cy.contains("Hugo i Sølvskoven 2").should(($el) =>
      assertCurrentLeftScroll(
        $el[0].getBoundingClientRect().left,
        leftScroll.at(-1)
      )
    );
    cy.contains("Hugo i Sølvskoven 3");
    cy.contains("Hugo i Sølvskoven 3½");
    cy.contains("Hugo i Sølvskoven 4");

    // Second scroll
    cy.get("[data-cy=right_arrow]", { timeout: 10000 }).click();

    cy.get("#relatedWorks_slide").should(appendCurrentLeftScrollToArrayInner);

    cy.contains("Hugo i Sølvskoven 3").should(($el) =>
      assertCurrentLeftScroll(
        $el[0].getBoundingClientRect().left,
        leftScroll.at(-1)
      )
    );
    cy.contains("Hugo i Sølvskoven 3½").should(($el) =>
      assertCurrentLeftScroll(
        $el[0].getBoundingClientRect().left,
        leftScroll.at(-1)
      )
    );
    cy.contains("Hugo i Sølvskoven 4");
    cy.contains("Hugo i Sølvskoven 5");
    cy.contains("Hugo i Sølvskoven 6");
  });

  it("mobile", () => {
    cy.visit("/iframe.html?id=work-relatedworks--related-works-physical-book");

    cy.viewport(750, 1080);

    cy.get("[data-cy=right_arrow]").should("not.be.visible");
    cy.get("[data-cy=left_arrow]").should("not.be.visible");
  });
});

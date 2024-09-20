function assertCurrentLeftScroll(current, comparable) {
  expect(current).not.to.be.greaterThan(
    comparable,
    `Expected element scroll to be less than or equal to ${comparable} but was ${current}`
  );
}

function appendScrollToArray($el, arrayOfScrolls) {
  arrayOfScrolls.push($el.scrollLeft());
  assertCurrentLeftScroll(arrayOfScrolls.at(-1), arrayOfScrolls.at(-2));
}

describe("ScrollSnapSlider", () => {
  it("desktop", () => {
    cy.visit("/iframe.html?id=work-relatedworks--related-works-physical-book");

    cy.viewport(1920, 1080);

    let leftScroll = [0];
    function appendScrollToArrayWithProps($el) {
      appendScrollToArray($el, leftScroll);
    }

    cy.get("#relatedWorks_slide")
      .should("exist")
      .should(appendScrollToArrayWithProps);

    cy.contains("Hugo i Sølvskoven 2");
    cy.contains("Hugo i Sølvskoven 3");

    // First scroll
    cy.get("[data-cy=right_arrow]", { timeout: 10000 }).click();

    cy.get("#relatedWorks_slide").should(appendScrollToArrayWithProps);

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

    cy.get("#relatedWorks_slide").should(appendScrollToArrayWithProps);

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

  it(`Tabbing may be used to slide`, () => {
    cy.visit("/iframe.html?id=work-relatedworks--related-works-physical-book");

    cy.viewport(1920, 1080);

    let leftScroll = [0];
    function appendScrollToArrayWithProps($el) {
      appendScrollToArray($el, leftScroll);
    }

    cy.get("#relatedWorks_slide")
      .should("exist")
      .should(appendScrollToArrayWithProps);

    cy.get("[data-cy=link]").tabs(7);
    cy.get("#relatedWorks_slide").should(appendScrollToArrayWithProps);

    cy.contains("Hugo i Sølvskoven").should(($el) =>
      assertCurrentLeftScroll(
        $el[0].getBoundingClientRect().left,
        leftScroll.at(-1)
      )
    );
  });
});

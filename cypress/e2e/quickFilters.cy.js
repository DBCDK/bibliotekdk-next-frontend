import isEmpty from "lodash/isEmpty";

describe("Quickfilters", () => {
  it.skip(`Check quickfilters`, () => {
    cy.visit(
      "/iframe.html?id=advancedsearch-quickfilter--quick-filter-default"
    );

    // there should be 3 accordions in this story
    cy.get("div [role=group]").should("have.length", 3);

    // check that filter is set from url
    cy.get("div [role=group]")
      .eq(1)
      .find("[data-cy=list-button-1]")
      .should("have.attr", "aria-checked", "true");

    // another element should be unchecked
    cy.get("div [role=group]")
      .eq(1)
      .find("[data-cy=list-button-1]")
      .should("have.attr", "aria-checked", "true");

    // select another filter
    cy.get("div [role=group]").eq(1).find("[data-cy=list-button-1]").click();

    cy.get("div [role=group]")
      .eq(1)
      .find("[data-cy=list-button-1]")
      .should("not.have.attr", "aria-checked");

    cy.get("div [role=group]").eq(1).find("[data-cy=list-button-1]").click();

    cy.get("div [role=group]")
      .eq(1)
      .find("[data-cy=list-button-1]")
      .should("have.attr", "aria-checked", "true");

    // assert that url is set accordingly
    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const quickfilters = fisk.quickfilters;

      assert(quickfilters.includes("fiction"));
      assert(!quickfilters.includes("non-fiction"));
    });

    // clear the url
    cy.get("div [role=group]").eq(1).find("[data-cy=list-button-1]").click();
    // assert that filters are empty
    cy.get("[data-cy=router-query]").then((el) => {
      const fisk = JSON.parse(el.text());
      const quickfilters = fisk?.quickfilters;
      assert(isEmpty(quickfilters));
    });
  });
});

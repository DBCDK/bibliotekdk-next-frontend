/**
 * @file
 * Test functionality of Radio group
 */
describe("Radio", () => {
  it.only(`Tab leads to active element`, () => {
    cy.visit("/iframe.html?id=base-radio--radio-group");
    cy.tab();
    cy.focused().contains("Second");
    cy.focused().type("{downarrow}");
    cy.focused().contains("Third");
  });
  it(`Tab leads to first element`, () => {
    cy.visit("/iframe.html?id=base-radio--radio-group-no-initial-selection");
    cy.tab();
    cy.focused().contains("First");
  });
  it(`Down arrow changes focus`, () => {
    cy.visit("/iframe.html?id=base-radio--radio-group");
    cy.tab();
    cy.focused().type("{downarrow}");
    cy.focused().contains("Third");
    cy.focused().type("{downarrow}");
    cy.focused().contains("First");
    cy.focused().type("{downarrow}");
    cy.focused().contains("Second");
  });
  it(`Right arrow changes focus`, () => {
    cy.visit("/iframe.html?id=base-radio--radio-group");
    cy.tab();
    cy.focused().type("{rightarrow}");
    cy.focused().contains("Third");
    cy.focused().type("{rightarrow}");
    cy.focused().contains("First");
    cy.focused().type("{rightarrow}");
    cy.focused().contains("Second");
  });
  it(`Up arrow changes focus`, () => {
    cy.visit("/iframe.html?id=base-radio--radio-group");
    cy.tab();
    cy.focused().type("{uparrow}");
    cy.focused().contains("First");
    cy.focused().type("{uparrow}");
    cy.focused().contains("Third");
    cy.focused().type("{uparrow}");
    cy.focused().contains("Second");
  });
  it(`Left arrow changes focus`, () => {
    cy.visit("/iframe.html?id=base-radio--radio-group");
    cy.tab();
    cy.focused().type("{leftarrow}");
    cy.focused().contains("First");
    cy.focused().type("{leftarrow}");
    cy.focused().contains("Third");
    cy.focused().type("{leftarrow}");
    cy.focused().contains("Second");
  });
  it(`Disabled group can't be interacted with`, () => {
    cy.visit("/iframe.html?id=base-radio--disabled-radio-group");
    cy.tab();
    // It has focused element below radio button group
    cy.focused().contains("I am tabbable");
  });
});

/**
 * @file
 * Test functionality of recommendations.js
 */

describe('Work', () => {
  it(`Shows work data`, () => {
    cy.visit('/?path=/story/work-page--doppler');
    cy.contains('Doppler');
  });
});

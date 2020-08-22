/**
 * @file
 * Test functionality of recommendations.js
 */

describe('Work', () => {
  it(`Shows work data`, () => {
    cy.visit('/?path=/story/prototype-work--doppler');
    cy.contains('Doppler');
  });
});

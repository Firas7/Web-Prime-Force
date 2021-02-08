/// <reference types="cypress" />

const hostname = 'https://dev.claim-now.de';

describe('check if logout is successfully', () => {
  before(() => {
    cy.login('bluebug.claimnow+admin2@gmail.com', 'Test123_', hostname);
    cy.visit(hostname + '/admin');
  });

  context('Actions', () => {
    it('check logout icon & do logout', () => {
      cy.get('[data-cy=head-bar-logout-icon]')
        .should('be.visible')
        .should('not.be.disabled')
        .click();
    });
    it('check all params afer logout', () => {
      cy.expect(localStorage.getItem('access_token')).to.be.null;
      cy.url().should('eq', hostname + '/');
    });
  });
});

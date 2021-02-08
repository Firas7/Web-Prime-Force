/// <reference types="cypress" />

const hostname = 'https://dev.claim-now.de';
const id = '5e98443c8f239ba427e07240';

describe('check if administrator can login successfully', () => {
  context('Actions', () => {
    before(() => {
      cy.visit(hostname);
    });

    it('check if login form is accessible', () => {
      cy.get('[data-cy=showLogin]')
        .should('be.visible')
        .should('not.be.disabled')
        .click()
        .then(() => {
          cy.get('[data-cy=login-form]').should('be.visible');
          cy.get('[data-cy=login-btn]').should('be.disabled');
        });
    });

    it('insert wrong username into username (email) field of login form', () => {
      cy.get('[data-cy=login-email]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('bluebug.claimnow@gmail.com')
        .should('have.value', 'bluebug.claimnow@gmail.com');
      cy.get('[data-cy=login-btn]').should('be.disabled');
    });

    it('check password textfield of login form', () => {
      cy.get('[data-cy=login-password]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('Test123_')
        .should('have.value', 'Test123_');
      cy.get('[data-cy=login-btn]').should('not.be.disabled');
    });

    it('check if all server responses are as intended', () => {
      cy.server();
      cy.route('POST', hostname + '/api/users/authenticate').as('authenticate');
      cy.route('GET', hostname + '/api/profile/' + id).as('profile');

      cy.get('[data-cy=login-btn]').should('not.be.disabled').click();

      cy.wait('@authenticate').then((authenticate) => {
        expect(authenticate.status).eq(400);
        expect(authenticate.response.body).to.have.property(
          'message',
          'Incorrect email!'
        );
      });
    });
  });
});

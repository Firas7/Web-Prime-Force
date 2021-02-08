/// <reference types="cypress" />

const hostname = 'https://dev.claim-now.de';

describe('check if new user can be registered', () => {
  context('Actions', () => {
    before(() => {
      cy.visit(hostname);
    });

    it('check if login form is accessible', () => {
      cy.get('[data-cy=show-register-btn]')
        .should('be.visible')
        .should('not.be.disabled')
        .click()
        .then(() => {
          cy.get('[data-cy=register-form]').should('be.visible');
          cy.get('[data-cy=register-send-email-btn]').should('be.disabled');
        });
    });

    it('check username (email) textfield of login form', () => {
      cy.get('[data-cy=register-email]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('bluebug.claimnow+admin2@gmail.com')
        .should('have.value', 'bluebug.claimnow+admin2@gmail.com');
      cy.get('[data-cy=register-send-email-btn]').should('be.disabled');
    });

    it('check password textfield of login form', () => {
      cy.get('[data-cy=register-password]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('Test123_')
        .should('have.value', 'Test123_');
      cy.get('[data-cy=register-send-email-btn]').should('be.disabled');

      cy.get('[data-cy=register-password-match]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('Test123_')
        .should('have.value', 'Test123_');

      cy.get('[data-cy=register-send-email-btn]').should('be.disabled');
    });

    it('check firstname textfield of register form', () => {
      cy.get('[data-cy=register-firstname]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('Test')
        .should('have.value', 'Test');
      cy.get('[data-cy=register-send-email-btn]').should('be.disabled');
    });

    it('check lastname textfield of register form', () => {
      cy.get('[data-cy=register-lastname]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('User')
        .should('have.value', 'User');
    });

    it('check if all server responses are as intended', () => {
      cy.server();
      cy.route('POST', hostname + '/api/users/register').as('register');
      cy.get('[data-cy=register-send-email-btn]')
        .should('not.be.disabled')
        .click();
      cy.wait('@register').then((register) => {
        expect(register.status).eq(201);
        cy.expect(localStorage.key('access_token')).to.not.be.null;
        cy.get('[data-cy=register-close-btn]')
          .should('be.visible')
          .should('not.be.disabled')
          .click()
          .then(() => {
            cy.url().should('include', '/user');
          });
      });
    });
  });
});

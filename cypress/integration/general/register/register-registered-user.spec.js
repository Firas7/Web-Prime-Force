/// <reference types="cypress" />

const hostname = 'https://dev.claim-now.de';

describe('visit ' + hostname, () => {
  context('Actions', () => {
    before(() => {
      cy.visit(hostname);
    });

    it('check if register form is accessible', () => {
      cy.get('[data-cy=show-register-btn]')
        .should('be.visible')
        .should('not.be.disabled')
        .click()
        .then(() => {
          cy.get('[data-cy=register-form]').should('be.visible');
          cy.get('[data-cy=register-send-email-btn]').should('be.disabled');
        });
    });

    it('check username (email) textfield of register form', () => {
      cy.get('[data-cy=register-email]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('bluebug.claimnow+admin2@gmail.com')
        .should('have.value', 'bluebug.claimnow+admin2@gmail.com');
      cy.get('[data-cy=register-send-email-btn]').should('be.disabled');
    });

    it('check password textfields of register form', () => {
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
        .type('Max')
        .should('have.value', 'Max');
      cy.get('[data-cy=register-send-email-btn]').should('be.disabled');
    });

    it('check lastname textfield of register form', () => {
      cy.get('[data-cy=register-lastname]')
        .should('not.be.disabled')
        .should('be.empty')
        .type('Mustermann')
        .should('have.value', 'Mustermann');
    });

    it('check if all server responses are as intended', () => {
      cy.server();
      cy.route('POST', hostname + '/api/users/register').as('register');
      cy.get('[data-cy=register-send-email-btn]')
        .should('not.be.disabled')
        .click();
      cy.wait('@register').then((register) => {
        expect(register.status).eq(400);
        expect(register.response.body).not.to.have.property('access_token');
        expect(register.response.body).to.have.property(
          'message',
          'Email taken'
        );
      });
    });
  });
});

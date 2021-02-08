/// <reference types="cypress" />

describe('login as administrator', () => {
  context('Actions', () => {
    beforeEach(() => {
      cy.login('', '');
    });

    it('check all server responses', () => {
      cy.server();

      cy.route(
        'GET',
        'http://127.0.0.1/api/profile/5e8df15ec460f70020fe912b'
      ).as('getProfile');

      cy.route(
        'GET',
        'http://127.0.0.1/api/contracts/user/5e677102c21f960006380a9d'
      ).as('getContracts');

      cy.route(
        'GET',
        'http://127.0.0.1/api/insured/pidInUser/5e677102c21f960006380a9d'
      ).as('getInsured');

      cy.route('GET', 'http://127.0.0.1/api/clerk/5e677102c21f960006380a9d').as(
        'getClerk'
      );

      cy.visit('http://127.0.0.1/user');

      cy.wait([
        '@getProfile',
        '@getContracts',
        '@getInsured',
        '@getClerk',
      ]).spread((profile, contracts, insured, clerk) => {
        expect(profile.status).eq(200);
        expect(contracts.status).eq(200);
        expect(insured.status).eq(200);
        expect(clerk.status).eq(200);
      });
    });

    it('check edit icon in user menu', () => {
      cy.get('[data-cy=user-card-edit-data-icon]')
        .should('be.visible')
        .should('not.be.disabled')
        .click();
    });

    it('check textfields userdata edit section', () => {
      cy.get('[data-cy=user-card-edit-firstname]')
        .should('be.visible')
        .should('not.be.disabled')
        //.should('not.be.empty')
        .clear()
        .type('Max')
        .should('have.value', 'Max');

      cy.get('[data-cy=user-card-edit-lastname]')
        .should('be.visible')
        .should('not.be.disabled')
        //.should('not.be.empty')
        .clear()
        .type('Mustermann')
        .should('have.value', 'Mustermann');

      cy.get('[data-cy=user-card-edit-email]')
        .should('be.visible')
        .should('not.be.disabled')
        //.should('not.be.empty')
        .clear()
        .type('admin@admin.de')
        .should('have.value', 'admin@admin.de');
    });
    it('check all server responses', () => {
      cy.server();

      cy.route(
        'PUTg',
        'http://127.0.0.1/api/profile/5e8df15ec460f70020fe912b'
      ).as('updateProfile');

      cy.get('[data-cy=user-card-edit-save-btn]')
        .should('be.visible')
        .should('not.be.disabled')
        .click();

      cy.wait('@updateProfile').then((profile) => {
        expect(profile.status).eq(200);
      });
    });
  });
});

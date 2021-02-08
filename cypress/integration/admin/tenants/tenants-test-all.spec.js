/// <reference types="cypress" />

const hostname = 'https://dev.claim-now.de';

describe('check all functionalities of tenants table', () => {
  context('Actions', () => {
    beforeEach(() => {
      cy.login('bluebug.claimnow+admin2@gmail.com', 'Test123_', hostname);
    });

    for (let i = 0; i < 1; i++) {
      let tenantId = '';

      it('check if form dialog is accessible', () => {
        cy.server();

        cy.route('GET', hostname + '/api/tenants?beginAtIndex=0&limit=20').as(
          'getTenants'
        );
        cy.visit(hostname + '/admin/tenants');

        cy.wait('@getTenants').then((get) => {
          expect(get.status).eq(200);
          expect(get.response.body).to.have.property(
            'message',
            'Success! Fetched tenants between index: 0 and 020'
          );
        });

        cy.get('[data-cy=tenants-table-add-btn]')
          .should('be.visible')
          .should('not.be.disabled')
          .click();

        cy.get('[data-cy=tenants-form-dialog-card]').should('be.visible');
        // .should(Klienten/Tenants/g);

        cy.get('[data-cy=tenants-form-dialog-add-btn').should('be.disabled');
      });

      it('check if all textfields in form dialog are ok', () => {
        cy.get('[data-cy=tenants-form-dialog-firstname-textfield]')
          .should('be.visible')
          .should('not.be.disabled')
          .type('Test')
          .should('have.value', 'Test');
        cy.get('[data-cy=tenants-form-dialog-add-btn').should('be.disabled');

        cy.get('[data-cy=tenants-form-dialog-lastname-textfield]')
          .should('be.visible')
          .should('not.be.disabled')
          .type('Test123')
          .should('have.value', 'Test123');
        cy.get('[data-cy=tenants-form-dialog-add-btn').should('be.disabled');

        cy.get('[data-cy=tenants-form-dialog-url-textfield]')
          .should('be.visible')
          .should('not.be.disabled')
          .type('http://www.google.de')
          .should('have.value', 'http://www.google.de');
        cy.get('[data-cy=tenants-form-dialog-add-btn').should('be.disabled');

        cy.get('[data-cy=tenants-form-dialog-pathname-textfield]')
          .should('be.visible')
          .should('not.be.disabled')
          .type('/Max/Mustermann')
          .should('have.value', '/Max/Mustermann');
        cy.get('[data-cy=tenants-form-dialog-add-btn').should(
          'not.be.disabled'
        );
      });

      it('check if tenant is correctly saved (response from server)', () => {
        cy.server();
        cy.route('POST', hostname + '/api/tenants').as('addTentant');
        cy.route('GET', hostname + '/api/tenants?beginAtIndex=0&limit=20').as(
          'getTentants'
        );
        cy.get('[data-cy=tenants-form-dialog-add-btn]')
          .should('not.be.disabled')
          .click();
        cy.wait(['@addTentant', '@getTentants']).spread((add, get) => {
          tenantId = add.response.body.insertedId;
          expect(add.status).eq(201);
          expect(add.response.body).to.have.property(
            'message',
            'Success! Created tenant with id: ' + tenantId
          );
          expect(get.status).eq(200);
        });
      });

      it('check if new tenant is in list', () => {
        cy.get('[data-cy=tenants-data-table]').contains(tenantId);
      });

      it('edit inserted tenant', () => {
        cy.server();

        cy.route('PUT', hostname + '/api/tenants/' + tenantId).as('editTenant');

        cy.get(
          ':first-child() > .text-start > [data-cy=tenants-table-edit-icon] > .v-btn__content > .v-icon'
        )
          .should('not.be.disabled')
          .click();

        cy.get('[data-cy=tenants-form-dialog-firstname-textfield]')
          .should('be.visible')
          .should('not.be.disabled')
          .should('have.value', 'Test')
          .clear()
          .type('Cypress456')
          .should('have.value', 'Cypress456');

        cy.get('[data-cy=tenants-form-dialog-lastname-textfield]')
          .should('be.visible')
          .should('not.be.disabled')
          .should('have.value', 'Test123')
          .clear()
          .type('Cypress123')
          .should('have.value', 'Cypress123');

        cy.get('[data-cy=tenants-form-dialog-edit-btn]')
          .should('not.be.disabled')
          .click();

        cy.wait('@editTenant').then((response) => {
          expect(response.status).eq(200);
          expect(response.response.body).to.have.property(
            'message',
            'Successfully updated tenant data!'
          );
        });
      });

      it('check pagignation', () => {
        cy.get('[data-cy=tenants-table-pagignation-documents-text]')
          .invoke('text')
          .should('contain', '1 - 20');

        cy.get('[data-cy=tenants-table-next-btn]')
          .should('not.be.disabled')
          .click();

        cy.get('[data-cy=tenants-table-pagignation-documents-text]')
          .invoke('text')
          .should('contain', '21 - ');

        cy.get('[data-cy=tenants-table-previous-btn]')
          .should('not.be.disabled')
          .click();

        cy.get('[data-cy=tenants-table-pagignation-documents-text]')
          .invoke('text')
          .should('contain', '1 - 20');
      });

      it('remove inserted tenant from list', () => {
        cy.server();

        cy.route('DELETE', hostname + '/api/tenants/' + tenantId).as(
          'deleteTenant'
        );
        cy.get(
          ':first-child() > .text-start > [data-cy=tenants-table-delete-icon] > .v-btn__content > .v-icon'
        )
          .should('not.be.disabled')
          .click();
        cy.wait('@deleteTenant').then((response) => {
          expect(response.status).eq(200);
          expect(response.response.body).to.have.property(
            'message',
            'Success! Deleted a tenant'
          );
        });
      });

      it('check if new tenant is no longer in list', () => {
        cy.get('[data-cy=tenants-data-table]')
          .contains(tenantId)
          .should('not.exist');
      });
    }
  });
});

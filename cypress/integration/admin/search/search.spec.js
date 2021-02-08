/// <reference types="cypress" />

const hostname = 'https://dev.claim-now.de';

describe('check if search functionallity works correct', () => {
  context('Actions', () => {
    beforeEach(() => {
      cy.login('bluebug.claimnow+admin2@gmail.com', 'Test123_', hostname);
    });

    it('check if search icon is valid', () => {
      cy.visit(hostname + '/admin');
      cy.get('[data-cy=head-bar-search-icon]')
        .should('be.visible')
        .should('not.be.disabled')
        .click();
    });

    it('search test (0)', () => {
      let input = 'Tim';

      cy.server();

      cy.route(
        'GET',
        hostname + '/api/search/' + input + '?beginAtIndex=0&limit=20'
      ).as('search');

      cy.get('[data-cy=admin-search-textfield]')
        .clear()
        .should('be.visible')
        .should('not.be.disabled')
        .type(input)
        .type('{enter}');

      cy.wait('@search').then((search) => {
        expect(search.status).eq(200);
      });
    });

    it('search test (1)', () => {
      let input = 'Hallo';

      cy.server();

      cy.route(
        'GET',
        hostname + '/api/search/' + input + '?beginAtIndex=0&limit=20'
      ).as('search');

      cy.get('[data-cy=admin-search-textfield]')
        .clear()
        .should('be.visible')
        .should('not.be.disabled')
        .type(input)
        .type('{enter}');

      cy.wait('@search').then((search) => {
        expect(search.status).eq(200);
      });
    });

    it('search test (2)', () => {
      let input = 'Max';

      cy.server();

      cy.route(
        'GET',
        hostname + '/api/search/' + input + '?beginAtIndex=0&limit=20'
      ).as('search');

      cy.get('[data-cy=admin-search-textfield]')
        .clear()
        .should('be.visible')
        .should('not.be.disabled')
        .type(input)
        .type('{enter}');

      cy.wait('@search').then((search) => {
        expect(search.status).eq(200);
      });
    });

    it('search test (3)', () => {
      let input = 'Dr. Admin';

      cy.server();

      cy.route(
        'GET',
        hostname + '/api/search/' + input + '?beginAtIndex=0&limit=20'
      ).as('search');

      cy.get('[data-cy=admin-search-textfield]')
        .clear()
        .should('be.visible')
        .should('not.be.disabled')
        .type(input)
        .type('{enter}');

      cy.wait('@search').then((search) => {
        expect(search.status).eq(200);
      });
    });

    it('search test (4)', () => {
      let input = 'Test';

      cy.server();

      cy.route(
        'GET',
        hostname + '/api/search/' + input + '?beginAtIndex=0&limit=20'
      ).as('search');

      cy.get('[data-cy=admin-search-textfield]')
        .clear()
        .should('be.visible')
        .should('not.be.disabled')
        .type(input)
        .type('{enter}');

      cy.wait('@search').then((search) => {
        expect(search.status).eq(200);
      });
    });

    it('search test (5)', () => {
      let input = 'Herr Hans Peter';

      cy.server();

      cy.route(
        'GET',
        hostname + '/api/search/' + input + '?beginAtIndex=0&limit=20'
      ).as('search');

      cy.get('[data-cy=admin-search-textfield]')
        .clear()
        .should('be.visible')
        .should('not.be.disabled')
        .type(input)
        .type('{enter}');

      cy.wait('@search').then((search) => {
        expect(search.status).eq(200);
      });
    });
  });
});

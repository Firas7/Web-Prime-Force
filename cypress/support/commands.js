// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password, hostname) => {
  cy.request({
    method: 'POST',
    url: hostname + '/api/users/authenticate',
    body: {
      email: email,
      password: password,
    },
  }).then((response) => {
    window.localStorage.setItem('access_token', response.body.id_token);
  });
});

Cypress.Commands.add('hostname', () => {
  return '127.0.0.1';
});

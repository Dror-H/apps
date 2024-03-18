// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { fixture_user } from '../fixtures/user';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      login(): void;
      testId(value: string);
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-namespace

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: 'https://app-api-staging.instigo.io/auth/signin',
    body: {
      email: fixture_user.email,
      password: fixture_user.password,
    },
  }).then((resp) => {
    const jwt = resp.body.token;
    cy.visit(`/token/${jwt}`);
  });
});

Cypress.Commands.add('testId', (value) => {
  return cy.get(`[test-id=${value}]`);
});

import { fixture_user } from '../fixtures/user';

describe('instigo-app', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    cy.testId('login-title').contains('Login to Instigo');
  });

  it('should go to auth register', () => {
    cy.testId('top-register-button').click();
    cy.url().should('include', '/auth/register');
    cy.testId('register-title').contains('Create an account');
    cy.testId('top-sign-in').click();
  });

  it('should login form', () => {
    cy.testId('email-input').type(fixture_user.email);
    cy.testId('password-input').type(fixture_user.password);
    cy.testId('login-btn').click();
    cy.url().should('include', '/dashboard/workspace');
  });

  it('should logout', () => {
    cy.login();
    cy.url().should('include', '/dashboard/workspace');
    cy.testId('top-profile-dropdown').click();
    cy.testId('top-sign-out').click();
    cy.url().should('include', '/auth/login');
  });
});

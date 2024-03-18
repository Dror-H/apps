describe('account-control', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/account-control/profile');
  });

  it('should go to account control', () => {
    cy.get('.ant-page-header').should('contain', 'Account Control');
  });

  it('should navigate to account security', () => {
    cy.testId('account-security').click();
    cy.url().should('include', 'account-security');
  });
  it('should navigate to workspaces', () => {
    cy.testId('workspaces').click();
    cy.url().should('include', 'workspaces');
  });

  it('should navigate to subscription', () => {
    cy.testId('your-subscription').click();
    cy.url().should('include', 'subscription');
  });

  it('should navigate to invoices', () => {
    cy.testId('invoices').click();
    cy.url().should('include', 'invoices');
  });
});

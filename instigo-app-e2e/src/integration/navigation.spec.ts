describe('navigation', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should go to campaigns', () => {
    cy.testId('campaigns-side-bar-button').click({ multiple: true });
    cy.url().should('include', 'campaigns');
  });
  it('should go to new campaigns', () => {
    cy.testId('new-campaign-side-bar-button').click({ multiple: true });
    cy.url().should('include', 'new-campaign');
  });
  it('should go to campaign-draft', () => {
    cy.testId('campaign-drafts-side-bar-button').click({ multiple: true });
    cy.url().should('include', 'campaign-draft');
  });

  it('should go to ad-templates', () => {
    cy.testId('ad-templates-side-bar-button').click({ multiple: true });
    cy.url().should('include', 'ad-templates');
  });
  it('should go to audiences', () => {
    cy.testId('audiences-side-bar-button').click({ multiple: true });
    cy.url().should('include', 'audiences');
  });
  it('should go to leadgen-form', () => {
    cy.testId('lead-forms-side-bar-button').click({ multiple: true });
    cy.url().should('include', 'leadgen-form');
  });
});

import { generateAdName, generateAdSetName } from '@api/campaign/data/campaing-name-generator';
import { AdTemplateType, BudgetSettings, DeliverySettings } from '@instigo-app/data-transfer-object';

const campaignMock = {
  budgetSettings: {
    budgetType: 'daily',
  },
  deliverySettings: {
    optimizedFor: 'IMPRESSIONS',
    costCap: 0.01,
  },
};

const campaignMockNoCostCap = {
  budgetSettings: {
    budgetType: 'daily',
  },
  deliverySettings: {
    optimizedFor: 'IMPRESSIONS',
    costCap: null,
  },
};

const adTemplateMockNoCallToAction = {
  callToAction: null,
};

const adTemplateMock = {
  callToAction: 'NO_BUTTON',
};

describe('Ad Name Generator', () => {
  it('should generate adSet name', () => {
    expect(
      generateAdSetName(
        campaignMock.budgetSettings as BudgetSettings,
        campaignMock.deliverySettings as DeliverySettings,
      ),
    ).toEqual('Daily Budget-IMPRESSIONS-0.01');
  });
  it('should generate adSet name', () => {
    expect(
      generateAdSetName(
        campaignMockNoCostCap.budgetSettings as BudgetSettings,
        campaignMockNoCostCap.deliverySettings as DeliverySettings,
      ),
    ).toEqual('Daily Budget-IMPRESSIONS-NO_COST_CAP');
  });

  it('should generate ad name', () => {
    expect(generateAdName(adTemplateMock, AdTemplateType.IMAGE)).toEqual('New Ad-Image-NO_BUTTON');
  });

  it('should generate ad name', () => {
    expect(generateAdName(adTemplateMockNoCallToAction, AdTemplateType.VIDEO)).toEqual(
      'New Ad-Video-NO_CALL_TO_ACTION',
    );
  });
});

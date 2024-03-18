import { AdTemplateType, BudgetSettings, DeliverySettings } from '@instigo-app/data-transfer-object';

export const generateAdSetName = (budgetSettings: BudgetSettings, deliverySettings: DeliverySettings): string => {
  const budgetTypeTitleCase = titleCase(budgetSettings.budgetType) + ' Budget';
  const optimization = deliverySettings.optimizedFor;
  const pricing = deliverySettings.costCap ?? 'NO_COST_CAP';
  return `${budgetTypeTitleCase}-${optimization}-${pricing}`;
};

export const generateAdName = (campaignCreatives: any, adTemplateType: AdTemplateType): string => {
  const adPost = 'New Ad';
  const adType = titleCase(adTemplateType);
  const callToAction = campaignCreatives.callToAction ?? 'NO_CALL_TO_ACTION';
  return `${adPost}-${adType}-${callToAction}`;
};

const titleCase = (value: string) => value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();

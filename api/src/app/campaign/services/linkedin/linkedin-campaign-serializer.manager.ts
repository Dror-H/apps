import {
  AdCreationDTO,
  BudgetType,
  CampaignCreationDTO,
  LinkedinAdCreationDto,
  LinkedinBudgetSettings,
  LinkedinCampaignCreationDto,
  LinkedinCampaignCreatives,
  LinkedinCampaignDraft,
  LinkedinCampaignSettings,
  LinkedinTargetingSettings,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import { concatTimeToDate } from '@api/shared/chunk-time-range';

export class LinkedinCampaignSerializerManager {
  private readonly campaignSettings: LinkedinCampaignSettings;
  private readonly budgetSettings: LinkedinBudgetSettings;
  private readonly creativeSettings: LinkedinCampaignCreatives;
  private readonly targetingSettings: LinkedinTargetingSettings;

  constructor(campaign: LinkedinCampaignDraft) {
    this.campaignSettings = campaign.settings;
    this.budgetSettings = campaign.budget;
    this.creativeSettings = campaign.creatives;
    this.targetingSettings = campaign.targeting;
  }

  public createCampaignObject(): CampaignCreationDTO<LinkedinCampaignCreationDto> {
    const campaignObject: CampaignCreationDTO<LinkedinCampaignCreationDto> = {
      adAccount: this.campaignSettings.account,
      name: this.campaignSettings.name,
      status: this.campaignSettings.status,
      provider: this.campaignSettings.provider,
      providerSpecificFields: {
        campaignGroup: `urn:li:sponsoredCampaignGroup:${this.campaignSettings.campaignGroup.providerId}`,
        type: this.campaignSettings.type,
        unitCost: { amount: this.budgetSettings.spendCap.toString() },
        objectiveType: this.campaignSettings.objective,
        costType: this.budgetSettings.costType,
        locale: this.divideLocaleString(),
        runSchedule: {
          start: concatTimeToDate(this.budgetSettings.range.startDate, this.budgetSettings.range.startTime)?.getTime(),
        },
        ...this.dailyOrTotalBudget(),
        targetingCriteria: this.targetingSettings.targetingCriteria.target,
      },
    };
    this.addEndDateIfExists(campaignObject);
    return campaignObject;
  }

  public createAdObject(campaignId: string): AdCreationDTO<LinkedinAdCreationDto>[] {
    return this.creativeSettings.multivariate.adCombinations.map((creative) => ({
      provider: SupportedProviders.LINKEDIN,
      providerSpecificFields: {
        campaignId,
        type: this.campaignSettings.type,
        adTemplate: { ...creative },
      },
    }));
  }

  private addEndDateIfExists(campaignObject): void {
    if (this.budgetSettings.range.endDate) {
      campaignObject.providerSpecificFields.runSchedule.end = concatTimeToDate(
        this.budgetSettings.range.endDate,
        this.budgetSettings.range.endTime,
      )?.getTime();
    }
  }

  private dailyOrTotalBudget() {
    if (this.budgetSettings.budgetType === BudgetType.DAILY) {
      return { dailyBudget: { amount: this.budgetSettings.budget.toString() } };
    }
    if (this.budgetSettings.budgetType === BudgetType.LIFETIME) {
      return { totalBudget: { amount: this.budgetSettings.budget.toString() } };
    }
  }

  private divideLocaleString() {
    // locale string looks like this: en_US
    const dividedLocale = this.targetingSettings.locale.split('_');
    return {
      country: dividedLocale[1],
      language: dividedLocale[0],
    };
  }
}

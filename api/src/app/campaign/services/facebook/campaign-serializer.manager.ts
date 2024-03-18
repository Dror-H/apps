import { generateAdName, generateAdSetName } from '@api/campaign/data/campaing-name-generator';
import { concatTimeToDate } from '@api/shared/chunk-time-range';
import {
  AdCreationDTO,
  AdSetCreationDTO,
  AdTemplateDataType,
  AdTemplateDTO,
  AdTemplateType,
  audienceSourceOptions,
  BudgetSettings,
  BudgetType,
  CampaignCreationDTO,
  CampaignSettings,
  CampaignStatusType,
  CreativeSettings,
  creativeSourceOptions,
  DeliverySettings,
  FacebookAdCreationDto,
  FacebookBidStrategyEnum,
  FacebookCampaignCreationDto,
  FacebookCampaignDraft,
  PacingType,
  TargetingSettings,
} from '@instigo-app/data-transfer-object';
import { zonedTimeToUtc } from 'date-fns-tz';

export class CampaignSerializerManager {
  private readonly campaignSettings: CampaignSettings;
  private readonly budgetSettings: BudgetSettings;
  private readonly deliverySettings: DeliverySettings;
  private readonly creativeSettings: CreativeSettings;
  private readonly targetingSettings: TargetingSettings;
  private readonly adSetFormat: string[];

  constructor(campaign: FacebookCampaignDraft) {
    this.campaignSettings = campaign.settings;
    this.budgetSettings = campaign.budget;
    this.deliverySettings = campaign.delivery;
    this.creativeSettings = campaign.creatives;
    this.adSetFormat = campaign.adSetFormat;
    this.targetingSettings = campaign.targeting;
  }

  public createCampaignCreationObject(): CampaignCreationDTO<FacebookCampaignCreationDto> {
    const campaignObject: CampaignCreationDTO<FacebookCampaignCreationDto> = {
      name: this.campaignSettings.name,
      status: this.campaignSettings.status,
      provider: this.campaignSettings.provider,
      adAccount: this.campaignSettings.account,
      providerSpecificFields: {
        objective: this.campaignSettings.objective,
        specialAdCategories: this.campaignSettings.specialCatsOptions,
        buyingType: this.campaignSettings.buyingType,
        spendCap: this.budgetSettings.spendCap,
      },
    };

    // when Campaign Budget Optimization is set true, the budget is set at campaign level
    if (this.deliverySettings.campaignBudgetOpti) {
      campaignObject.providerSpecificFields.dailyBudget =
        this.budgetSettings.budgetType === BudgetType.DAILY ? this.budgetSettings.budget : null;
      campaignObject.providerSpecificFields.lifetimeBudget =
        this.budgetSettings.budgetType === BudgetType.LIFETIME ? this.budgetSettings.budget : null;
      campaignObject.providerSpecificFields.bidStrategy = this.deliverySettings.bidStrategy as FacebookBidStrategyEnum;
    }
    return campaignObject;
  }

  public createAdSetCreationObject(): AdSetCreationDTO {
    const adSetObject: AdSetCreationDTO = {
      name: generateAdSetName(this.budgetSettings, this.deliverySettings),
      startTime: getConvertedTime('start', this.budgetSettings, this.campaignSettings),
      endTime: getConvertedTime('end', this.budgetSettings, this.campaignSettings),
      adSetSchedule: this.budgetSettings.adSetSchedule,
      status: CampaignStatusType.ACTIVE,
      optimizationGoal: this.deliverySettings.optimizedFor,
      billingEvent: this.deliverySettings.billingEvent,
      adSetFormat: createAdSetFormat(this.adSetFormat),
      targeting: getTargetingAccordingToType(this.targetingSettings),
      provider: this.campaignSettings.provider,
      pacingType: getPacingTypes(this.deliverySettings.acceleratedDelivery, this.budgetSettings.useDayparting),
      bidStrategy: this.deliverySettings.bidStrategy as FacebookBidStrategyEnum,
      bidAmount: this.deliverySettings.costCap,
      adAccount: this.campaignSettings.account,
      campaign: null,
      conversionEvents: this.deliverySettings.conversion?.conversionEvents,
      conversionPixel: this.deliverySettings.conversion?.conversionPixel,
      intervalDays: this.deliverySettings.reach?.intervalDays,
      maxFrequency: this.deliverySettings.reach?.maxFrequency,
      promotedPageId: this.promotePage(),
    };

    // when Campaign Budget Optimization is set true, the budget is set at campaign level but normally it is at adSet level
    if (!this.deliverySettings.campaignBudgetOpti) {
      adSetObject.dailyBudget = this.budgetSettings.budgetType === BudgetType.DAILY ? this.budgetSettings.budget : null;
      adSetObject.lifetimeBudget =
        this.budgetSettings.budgetType === BudgetType.LIFETIME ? this.budgetSettings.budget : null;
    }

    return adSetObject;
  }

  public createAdObject(): AdCreationDTO<FacebookAdCreationDto>[] {
    return this.getCreativeAccordingToType();
  }

  private promotePage(): string {
    if (
      (this.campaignSettings.objective === 'LEAD_GENERATION' || this.campaignSettings.objective === 'PAGE_LIKES') &&
      this.creativeSettings.sourceType === creativeSourceOptions[0].id
    ) {
      return this.creativeSettings.multivariate?.adCombinations[0]?.social?.promotePage;
    }
    return null;
  }

  private getCreativeAccordingToType(): AdCreationDTO<FacebookAdCreationDto>[] {
    switch (this.creativeSettings.sourceType) {
      case creativeSourceOptions[0].id: {
        return this.creativeSettings.multivariate.adCombinations.map((adTemplate, index) => ({
          provider: this.campaignSettings.provider,
          adAccount: this.campaignSettings.account,
          status: CampaignStatusType.ACTIVE,
          providerSpecificFields: {
            name: `${generateAdName(adTemplate, this.creativeSettings.multivariate.adTemplateType)}#${index + 1}`,
            adTemplate: createAdTemplateObject(
              adTemplate,
              this.creativeSettings.multivariate.adTemplateType,
              this.campaignSettings.objective,
            ),
          },
        }));
      }
      case creativeSourceOptions[1].id: {
        return this.creativeSettings.existingTemplate.adCombinations.map((adTemplate, index) => ({
          provider: this.campaignSettings.provider,
          adAccount: this.campaignSettings.account,
          status: CampaignStatusType.ACTIVE,
          providerSpecificFields: {
            name: `${generateAdName(adTemplate, adTemplate.adTemplateType)}#${index + 1}`,
            adTemplate: createAdTemplateObject(adTemplate, adTemplate.adTemplateType, this.campaignSettings.objective),
          },
        }));
      }
      case creativeSourceOptions[2].id: {
        return this.getExistingPost();
      }
    }
  }

  private getExistingPost(): AdCreationDTO<FacebookAdCreationDto>[] {
    const selectedPost = this.creativeSettings.existingPost.selectedPost;
    switch (selectedPost.adTemplateType) {
      case AdTemplateType.EXISTING_POST: {
        return [
          {
            provider: this.campaignSettings.provider,
            adAccount: this.campaignSettings.account,
            status: CampaignStatusType.ACTIVE,
            providerSpecificFields: {
              name: `Ad created from post ${selectedPost.headline}`,
              existingPost: selectedPost,
              instagramAccount: selectedPost.instagramAccount,
            },
          },
        ];
      }
      default: {
        return [
          {
            provider: this.campaignSettings.provider,
            adAccount: this.campaignSettings.account,
            status: CampaignStatusType.ACTIVE,
            providerSpecificFields: {
              name: `Ad created from post ${selectedPost.headline}`,
              adTemplate: createAdTemplateObject(
                selectedPost,
                selectedPost.adTemplateType,
                this.campaignSettings.objective,
              ),
            },
          },
        ];
      }
    }
  }
}

const getPacingTypes = (acceleratedDelivery: boolean, useDayparting: boolean): PacingType[] => {
  const pacingType = [];
  if (acceleratedDelivery) {
    pacingType.push(PacingType.NO_PACING);
  }
  if (useDayparting) {
    pacingType.push(PacingType.DAY_PARTING);
  }
  if (pacingType.length === 0) {
    pacingType.push(PacingType.STANDARD);
  }
  return pacingType;
};

const createAdSetFormat = (adSetFormat: any) => {
  const result = {};
  adSetFormat.forEach((item) => {
    if (result.hasOwnProperty(item.platform)) {
      result[item.platform].push(item.value);
    } else {
      result[item.platform] = [item.value];
    }
  });
  return result;
};

const getTargetingAccordingToType = (targetingSettings: TargetingSettings) => {
  switch (targetingSettings.targetingType) {
    case audienceSourceOptions[0].id: {
      return targetingSettings.createAudience.target;
    }
    case audienceSourceOptions[1].id: {
      return targetingSettings.loadAudience.target;
    }
  }
};

const createAdTemplateObject = (
  creative: AdTemplateDataType,
  adTemplateType: AdTemplateType,
  campaignObjective: string,
): Partial<AdTemplateDTO> => ({
  data: creative,
  adTemplateType,
  campaignObjective: campaignObjective,
});

export const getConvertedTime = (
  type: 'start' | 'end',
  budgetSettings: BudgetSettings,
  campaignSettings: CampaignSettings,
): Date | null => {
  const { startDate, startTime, endDate, endTime } = budgetSettings.range || {};

  const isTimeNull = {
    startTime: !budgetSettings.range.startTime || !budgetSettings.range.startDate,
    endTime: !budgetSettings.range.endDate || !budgetSettings.range.endTime,
  };

  let convertTimeInputs: [Date, string];
  if (type === 'start') {
    if (isTimeNull.startTime) return null;
    convertTimeInputs = [startDate, startTime];
  } else {
    if (isTimeNull.endTime) return null;
    convertTimeInputs = [endDate, endTime];
  }

  return zonedTimeToUtc(concatTimeToDate(...convertTimeInputs), campaignSettings.account.timezoneName);
};

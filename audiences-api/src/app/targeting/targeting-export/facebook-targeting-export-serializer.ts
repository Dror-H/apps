import {
  AdAccountDTO,
  AdSetCreationDTO,
  CampaignCreationDTO,
  CampaignEffectiveStatusType,
  CampaignStatusType,
  FacebookBidStrategyEnum,
  FacebookCampaignCreationDto,
  PacingType,
  SupportedProviders,
  TargetingDto,
} from '@instigo-app/data-transfer-object';
import { format } from 'date-fns';

export class FacebookTargetingExportSerializer {
  public constructor(private name: string, private _adAccount: AdAccountDTO, private _targeting: TargetingDto) {}

  public get adAccount(): AdAccountDTO {
    return this._adAccount;
  }

  public get targeting(): TargetingDto {
    return this._targeting;
  }

  public serializeCampaignObject(): CampaignCreationDTO<FacebookCampaignCreationDto> {
    return {
      name: `Instigo Audiences | ${this.name || this.getFormattedDate()}`,
      status: CampaignStatusType.PAUSED,
      effectiveStatus: CampaignEffectiveStatusType.IN_PROCESS,
      provider: SupportedProviders.FACEBOOK,
      adAccount: this.adAccount,
      providerSpecificFields: {
        objective: 'LINK_CLICKS',
        specialAdCategories: null,
        buyingType: 'auction',
        spendCap: 20,
        dailyBudget: 20,
        bidStrategy: FacebookBidStrategyEnum.LOWEST_COST_WITHOUT_CAP,
      },
    } as CampaignCreationDTO<FacebookCampaignCreationDto>;
  }

  public serializeAdSetCreationObject(): Partial<AdSetCreationDTO> {
    return {
      name: `Instigo Audiences | ${this.name || this.getFormattedDate()}`,
      status: CampaignStatusType.ACTIVE,
      optimizationGoal: 'LINK_CLICKS',
      billingEvent: 'IMPRESSIONS',
      bidStrategy: FacebookBidStrategyEnum.LOWEST_COST_WITH_BID_CAP,
      bidAmount: null,
      provider: SupportedProviders.FACEBOOK,
      targeting: this.targeting,
      startTime: new Date(Date.now()),
      pacingType: [PacingType.STANDARD],
      adAccount: this.adAccount,
      campaign: null,
    };
  }

  private getFormattedDate(): string {
    return format(new Date(), 'MMM dd Y HH:mm:ss');
  }
}

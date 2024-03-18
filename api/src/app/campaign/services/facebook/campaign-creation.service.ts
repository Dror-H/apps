import { AdSet } from '@api/ad-set/data/ad-set.entity';
import { Ad } from '@api/ad/data/ad.entity';
import { Campaign } from '@api/campaign/data/campaign.entity';
import { CampaignSerializerManager } from '@api/campaign/services/facebook/campaign-serializer.manager';
import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { CreationException } from '@instigo-app/api-shared';
import {
  AdAccountDTO,
  AdCreationDTO,
  AdSetCreationDTO,
  AdSetDTO,
  CampaignCreationDTO,
  CampaignCreationNotification,
  CampaignDTO,
  CampaignNotification,
  FacebookAdCreationDto,
  FacebookCampaignDraft,
  InstigoNotification,
  LinkedinAdCreationDto,
  NOTIFICATION_EVENT,
  NotificationSupportedProviders,
  NotificationType,
  StepFailure,
  SupportedProviders,
} from '@instigo-app/data-transfer-object';
import {
  ThirdPartyAdApiService,
  ThirdPartyAdSetApiService,
  ThirdPartyCampaignApiService,
} from '@instigo-app/third-party-connector';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import to from 'await-to-js';
import { Repository } from 'typeorm';
import { CampaignService } from '@api/campaign/services/campaign.service';

@Injectable()
export class CampaignCreationService {
  private readonly logger = new Logger(CampaignCreationService.name);

  @Inject(ThirdPartyCampaignApiService)
  private readonly thirdPartyCampaignApiService: ThirdPartyCampaignApiService;

  @Inject(ThirdPartyAdSetApiService)
  private readonly thirdPartyAdSetApiService: ThirdPartyAdSetApiService;

  @Inject(ThirdPartyAdApiService)
  private readonly thirdPartyAdApiService: ThirdPartyAdApiService;

  @Inject(MailerService)
  private readonly mailerService: MailerService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(CampaignService)
  private readonly campaignService: CampaignService;

  @InjectRepository(Campaign)
  private readonly campaignRepository: Repository<Campaign>;

  @InjectRepository(AdSet)
  private readonly adSetRepository: Repository<AdSet>;

  @InjectRepository(Ad)
  private readonly adRepository: Repository<Ad>;

  constructor(private eventEmitter: EventEmitter2) {}

  async create(options: {
    payload: {
      campaign: FacebookCampaignDraft;
      campaignDraftId: string;
    };
    workspace: Workspace;
    user: Partial<User>;
  }): Promise<FacebookCampaignDraft> {
    const { payload, workspace, user } = options;
    const serializedCampaign = this.serializeCampaign(payload);

    if (serializedCampaign.err === true) {
      const notificationErr = {
        success: false,
        user,
        campaign: { ...payload.campaign, campaignDraftId: payload.campaignDraftId } as any,
        stepFailure: StepFailure.CAMPAIGN,
        workspace,
      };
      await this.notify(notificationErr);
      throw new ForbiddenException({ error: StepFailure.CAMPAIGN });
    }

    const { campaign, adSet, ads } = serializedCampaign;

    const { adAccount, provider } = campaign;
    const { accessToken } = workspace?.owner?.getAccessToken({ provider });

    const [campErr, newCampaign] = await to(this.createCampaign({ campaign, adAccount, accessToken }));
    if (campErr) {
      await this.notify({
        success: false,
        user,
        adAccount,
        campaign: { ...payload.campaign, campaignDraftId: payload.campaignDraftId } as any,
        ads,
        stepFailure: StepFailure.CAMPAIGN,
        workspace,
        error: campErr,
      });
      throw campErr;
    }

    const [adSetErr, newAdSet] = await to(this.createAdSet({ accessToken, adSet, adAccount, campaign: newCampaign }));
    if (adSetErr) {
      await this.notify({
        success: false,
        user,
        adAccount,
        campaign: { ...newCampaign, campaignDraftId: payload.campaignDraftId } as any,
        ads,
        stepFailure: StepFailure.AD_SET,
        workspace,
        error: adSetErr,
      });
      await this.rollback({ accessToken, campaign: newCampaign, provider });
      throw adSetErr;
    }

    const [adsErr] = await to(this.createAds({ ads, campaign: newCampaign, adSet: newAdSet, adAccount, accessToken }));
    if (adsErr) {
      await this.notify({
        success: false,
        user,
        adAccount,
        campaign: { ...newCampaign, campaignDraftId: payload.campaignDraftId } as any,
        ads,
        stepFailure: StepFailure.AD,
        workspace,
        error: adsErr,
      });
      await this.rollback({ accessToken, campaign: newCampaign, provider });
      throw adsErr;
    }

    await this.campaignService.deleteCampaignDraft(payload.campaignDraftId);

    await this.notify({ success: true, user, adAccount, campaign: newCampaign, ads, workspace }).catch((e) => {
      this.logger.error(e);
    });

    await this.campaignService.recordThroughInstigo(newCampaign, adAccount, user, workspace);

    return payload.campaign;
  }

  private serializeCampaign(
    payload,
  ): Partial<{ campaign: CampaignCreationDTO<any>; adSet: AdSetCreationDTO; ads: AdCreationDTO<any>[]; err }> {
    try {
      const campaignSerializerManager = new CampaignSerializerManager(payload.campaign);
      const campaign = campaignSerializerManager.createCampaignCreationObject();
      const adSet = campaignSerializerManager.createAdSetCreationObject();
      const ads = campaignSerializerManager.createAdObject();
      return { campaign, adSet, ads };
    } catch (err) {
      return { err: true };
    }
  }

  private async rollback(options: { campaign: CampaignDTO; provider: SupportedProviders; accessToken: string }) {
    const { campaign, provider, accessToken } = options;
    const [thirdErr] = await to(
      this.thirdPartyCampaignApiService.delete({
        accessToken,
        provider,
        campaign,
      }),
    );
    if (thirdErr) {
      throw new Error('Rollback failed');
    }
    const [dbErr] = await to(this.campaignRepository.delete(campaign));
    if (dbErr) {
      throw new Error('Rollback failed');
    }
  }

  private async createCampaign(options: {
    campaign: CampaignCreationDTO<any>;
    adAccount: Partial<AdAccountDTO>;
    accessToken: string;
  }): Promise<Campaign> {
    const { campaign, adAccount, accessToken } = options;
    const { providerId, provider } = adAccount;
    const [err, [newCampaign]] = await to(
      this.thirdPartyCampaignApiService.create({
        accessToken,
        adAccountProviderId: providerId,
        provider,
        campaign,
      }),
    );
    if (!newCampaign || err) {
      this.logger.error(err);
      throw new CreationException({ stepFailure: StepFailure.CAMPAIGN, adAccount, provider, error: err });
    }
    newCampaign.adAccount = adAccount;
    return await this.campaignRepository.save(newCampaign);
  }

  private async createAdSet(options: {
    accessToken: string;
    adSet: Partial<AdSetCreationDTO>;
    adAccount: Partial<AdAccountDTO>;
    campaign: Partial<CampaignDTO>;
  }): Promise<AdSet> {
    const { adSet, accessToken, adAccount, campaign } = options;
    const { providerId, provider } = adAccount;
    const [err, newAdSet] = await to(
      this.thirdPartyAdSetApiService.create({
        accessToken,
        adAccountProviderId: providerId,
        provider,
        adSet: { ...adSet, campaign },
      }),
    );
    if (!newAdSet || err) {
      this.logger.error(err);
      throw new CreationException({ stepFailure: StepFailure.AD_SET, adAccount, provider, error: err });
    }
    newAdSet.adAccount = adAccount;
    newAdSet.campaign = campaign;
    return this.adSetRepository.save(newAdSet);
  }

  private async createAds(options: {
    ads: Partial<AdCreationDTO<FacebookAdCreationDto | LinkedinAdCreationDto>>[];
    adSet: Partial<AdSetDTO>;
    adAccount: Partial<AdAccountDTO>;
    campaign: Partial<CampaignDTO>;
    accessToken: string;
  }): Promise<Ad[]> {
    const { ads, accessToken, campaign, adSet, adAccount } = options;
    const { providerId, provider } = adAccount;
    const [err, newAds] = await to(
      this.thirdPartyAdApiService.createMany({
        accessToken,
        adAccountProviderId: providerId,
        provider,
        ads: ads.map((ad: Partial<AdCreationDTO<FacebookAdCreationDto | LinkedinAdCreationDto>>) => {
          ad.campaign = campaign;
          ad.providerSpecificFields.adSet = adSet;
          return ad;
        }),
      }),
    );
    if (!newAds || err) {
      this.logger.error(err);
      throw new CreationException({ stepFailure: StepFailure.AD, adAccount, provider, error: err });
    }
    return this.adRepository.save(newAds.map((item) => ({ ...item, adAccount, campaign, adSet })));
  }

  private async notify(options: CampaignNotification): Promise<void> {
    const { success, user, campaign, ads, stepFailure, error, workspace } = options;

    const context: CampaignCreationNotification = {
      success,
      campaign: {
        ...campaign,
        draft_url: `${this.configService.get('FRONTEND_HOST')}/new-campaign/${campaign.provider}/${
          (campaign as any)?.campaignDraftId
        }`,
      } as any,
      numberOfAds: ads?.length,
      failed_reason: {
        error: error?.trace?.error?.errorUserMsg || 'Unknown',
        campaign: {
          success: stepFailure !== StepFailure.CAMPAIGN,
        },
        adset: {
          success: stepFailure !== StepFailure.CAMPAIGN && stepFailure !== StepFailure.AD_SET,
        },
        ads: {
          success:
            stepFailure !== StepFailure.CAMPAIGN &&
            stepFailure !== StepFailure.AD_SET &&
            stepFailure !== StepFailure.AD,
        },
      },
    };

    const mail: ISendMailOptions = {
      to: user.email,
      subject: 'Campaign creation notification 🚀',
      template: 'campaign-creation-report',
      context,
    };

    await this.mailerService.sendMail(mail).catch((err) => {
      this.logger.error(err);
    });

    this.logger.log(JSON.stringify(mail));
    this.eventEmitter.emit(
      NOTIFICATION_EVENT,
      new InstigoNotification({
        title: `Campaign ${campaign?.name} created`,
        description: `Campaign ${campaign?.name} created`,
        workspace,
        provider: NotificationSupportedProviders.INSTIGO,
        type: success ? NotificationType.SUCCESS : NotificationType.ERROR,
        user,
      }),
    );
  }
}

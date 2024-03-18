import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AdAccountDTO,
  AdCreationDTO,
  CampaignCreationDTO,
  LinkedinAdCreationDto,
  LinkedinCampaignDraft,
  StepFailure,
} from '@instigo-app/data-transfer-object';
import { Workspace } from '@api/workspace/data/workspace.entity';
import { User } from '@api/user/data/user.entity';
import { LinkedinCampaignSerializerManager } from '@api/campaign/services/linkedin/linkedin-campaign-serializer.manager';
import to from 'await-to-js';
import { Campaign } from '@api/campaign/data/campaign.entity';
import { CreationException } from '@instigo-app/api-shared';
import { ThirdPartyAdApiService, ThirdPartyCampaignApiService } from '@instigo-app/third-party-connector';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad } from '@api/ad/data/ad.entity';
import { CampaignThroughInstigoRecord } from '@api/campaign/data/campaign-through-instigo-record.entity';
import { CampaignService } from '@api/campaign/services/campaign.service';

@Injectable()
export class LinkedinCampaignCreationService {
  private readonly logger = new Logger(LinkedinCampaignCreationService.name);

  @Inject(ThirdPartyCampaignApiService)
  private readonly thirdPartyCampaignApiService: ThirdPartyCampaignApiService;

  @Inject(ThirdPartyAdApiService)
  private readonly thirdPartyAdApiService: ThirdPartyAdApiService;

  @Inject(CampaignService)
  private readonly campaignService: CampaignService;

  @InjectRepository(Campaign)
  private readonly campaignRepository: Repository<Campaign>;

  @InjectRepository(Ad)
  private readonly adRepository: Repository<Ad>;

  public async create(options: {
    payload: {
      campaign: LinkedinCampaignDraft;
      campaignDraftId: string;
    };
    workspace: Workspace;
    user: Partial<User>;
  }): Promise<any> {
    const { payload, workspace, user } = options;
    const campaignSerializerManager = new LinkedinCampaignSerializerManager(payload.campaign);
    const campaign = campaignSerializerManager.createCampaignObject();

    const { adAccount, provider } = campaign;
    const { accessToken } = workspace?.owner?.getAccessToken({ provider });

    const [campErr, newCampaign] = await to(this.createCampaign({ campaign, adAccount, accessToken }));
    if (campErr) {
      throw campErr;
    }

    const ads = campaignSerializerManager.createAdObject(newCampaign.providerId);
    const [adErr, newAds] = await to(this.createAds({ ads, adAccount, accessToken, campaign: newCampaign }));

    if (adErr) {
      throw adErr;
    }

    await this.campaignService.deleteCampaignDraft(payload.campaignDraftId);

    // TODO: implement rollback
    // TODO: implement notification and email send

    await this.campaignService.recordThroughInstigo(newCampaign, adAccount, user, workspace);
    return payload.campaign;
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

  private async createAds(options: {
    ads: AdCreationDTO<LinkedinAdCreationDto>[];
    adAccount: Partial<AdAccountDTO>;
    accessToken: string;
    campaign: Campaign;
  }): Promise<any> {
    const { ads, accessToken, adAccount, campaign } = options;
    const { provider } = adAccount;
    const [err, newAds] = await to(
      this.thirdPartyCampaignApiService.patchCreativeOnCampaign({
        accessToken,
        adAccount,
        provider,
        ads,
      }),
    );
    if (err) {
      this.logger.error(err);
      throw new CreationException({ stepFailure: StepFailure.AD, adAccount, provider, error: err });
    }

    const entityAds = (newAds as any[]).map((ad) => ({
      ...ad,
      campaign: { id: campaign.id },
      adAccount: { id: adAccount.id },
    }));
    return this.adRepository.save(entityAds);
  }
}

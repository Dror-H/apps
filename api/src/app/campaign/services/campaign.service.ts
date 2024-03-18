import { AdAccountRepository } from '@api/ad-account/data/ad-account.repository';
import { sleep } from '@instigo-app/api-shared';
import {
  AdAccountDTO,
  CacheTtlSeconds,
  CampaignCreationDTO,
  CampaignDTO,
  LinkedinBidSuggestionsDto,
  LinkedinCampaignDraft,
  ResponseSuccess,
  SupportedProviders,
  TargetingDto,
  WorkspaceDTO,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyCampaignApiService } from '@instigo-app/third-party-connector';
import { CACHE_MANAGER, HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import to from 'await-to-js';
import { Cache } from 'cache-manager';
import { groupBy } from 'lodash';
import { from, Observable } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Campaign } from '../data/campaign.entity';
import { CampaignRepository } from '../data/campaign.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignDraft } from '@api/campaign-draft/data/campaign-draft.entity';
import { Repository } from 'typeorm';
import { CampaignThroughInstigoRecord } from '@api/campaign/data/campaign-through-instigo-record.entity';
import { User } from '@api/user/data/user.entity';
import { Workspace } from '@api/workspace/data/workspace.entity';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class CampaignService {
  private logger = new Logger(CampaignService.name);

  @Inject(ThirdPartyCampaignApiService)
  private readonly thirdPartyCampaignApiService: ThirdPartyCampaignApiService;

  @Inject(CampaignRepository)
  private readonly campaignRepository: CampaignRepository;

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  @InjectRepository(CampaignDraft)
  private readonly campaignDraftEntity: Repository<CampaignDraft>;

  @InjectRepository(CampaignThroughInstigoRecord)
  private readonly campaignThroughInstigoRecordRepository: Repository<CampaignThroughInstigoRecord>;

  async create(campaign: Partial<CampaignCreationDTO<any>>, currentWorkspace: WorkspaceDTO): Promise<CampaignDTO> {
    const { provider, adAccount } = campaign;
    const { accessToken } = currentWorkspace.owner.getAccessToken({ provider });
    const [builtCampaign] = await this.thirdPartyCampaignApiService.create({
      accessToken,
      adAccountProviderId: adAccount.providerId,
      provider,
      campaign,
    });
    builtCampaign.adAccount = adAccount;
    const ingoCampaign = this.campaignRepository.save(builtCampaign as Campaign);
    await this.cacheManager.reset();
    return ingoCampaign;
  }

  bulkPatch(options: { campaigns: Partial<CampaignDTO>[]; workspace: WorkspaceDTO }): Observable<any> {
    const { campaigns, workspace } = options;
    void this.cacheManager.reset();
    return from(Object.entries(groupBy(campaigns, 'provider'))).pipe(
      mergeMap(([provider, entries]) => {
        const { accessToken } = workspace.owner.getAccessToken({ provider });
        return this.thirdPartyCampaignApiService.bulkPatch({ provider, accessToken, campaigns: entries });
      }),
      switchMap(() => this.campaignRepository.save(campaigns)),
      map(() => new ResponseSuccess('Campaigns successfully updated')),
    );
  }

  async findCampaignTargeting(options: {
    workspace: WorkspaceDTO;
    provider: SupportedProviders;
    campaignId: string;
  }): Promise<TargetingDto> {
    const { campaignId, provider, workspace } = options;
    const cacheKey = `campaignTargeting-${provider}-${campaignId}`;
    let result = await this.cacheManager.get(cacheKey);
    if (result) {
      return result as any;
    }
    const { accessToken } = workspace.owner.getAccessToken({ provider });
    result = await this.thirdPartyCampaignApiService.findCampaignTargeting({
      accessToken,
      campaignId,
      provider,
    });
    await this.cacheManager.set(cacheKey, result, { ttl: CacheTtlSeconds.ONE_HOUR });
    return result as any;
  }

  async deleteById(campaignId: string, token?: { accessToken: string }): Promise<string> {
    const campaign = await this.campaignRepository.findOneOrFail(campaignId, { relations: ['adAccount'] });
    const { provider, adAccount } = campaign;
    const { accessToken } = token ? token : await this.adAccountRepository.findWithAccessToken({ id: adAccount.id });
    const deleteResult = await this.thirdPartyCampaignApiService.delete({
      accessToken,
      provider,
      campaign,
    });
    if (!deleteResult) {
      throw new HttpException(`Provider campaign with provider id: ${campaign.providerId} could not be deleted`, 500);
    }
    await this.campaignRepository.delete(campaignId);
    return campaignId;
  }

  async deleteMany(campaignIds: string[] = []): Promise<string[]> {
    const { results, errors } = await new PromisePool()
      .for(campaignIds)
      .withConcurrency(5)
      .process(async (campaignId: string) => {
        await sleep(100);
        const [err, deletedId] = await to(this.deleteById(campaignId));
        if (err) {
          this.logger.error(err);
          throw err;
        }
        return deletedId;
      });
    await this.cacheManager.reset();
    return results;
  }

  public async getBiddingSuggestions(
    campaign: Partial<LinkedinCampaignDraft>,
    workspace: WorkspaceDTO,
  ): Promise<LinkedinBidSuggestionsDto> {
    const { provider, account } = campaign.settings;
    const { accessToken } = workspace.owner.getAccessToken({ provider });
    return await this.thirdPartyCampaignApiService.getBiddingSuggestions({
      accessToken,
      adAccountProviderId: account.providerId,
      provider,
      campaign,
    });
  }

  public async deleteCampaignDraft(draftId: string): Promise<void> {
    const [err] = await to(this.campaignDraftEntity.delete({ id: draftId }));
    if (err) {
      this.logger.error(err);
    }
  }

  public async recordThroughInstigo(
    newCampaign: CampaignDTO,
    adAccount: AdAccountDTO,
    user: Partial<User>,
    workspace: Workspace,
  ): Promise<CampaignThroughInstigoRecord> {
    return await this.campaignThroughInstigoRecordRepository.save({
      provider_id: newCampaign.providerId,
      ad_account_id:
        adAccount.provider === SupportedProviders.FACEBOOK
          ? adAccount.providerId.split('act_')[1]
          : adAccount.providerId,
      user_id: user.id,
      provider: newCampaign.provider,
      workspace_id: workspace.id,
    } as any);
  }
}

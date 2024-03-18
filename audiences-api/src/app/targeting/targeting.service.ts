import { pMap, TargetingHelperService } from '@instigo-app/api-shared';
import {
  BrowseOutput,
  CacheTtlSeconds,
  FacebookTargetingOptionStatus,
  InstigoTargetingTypes,
  ReachOutputDto,
  SearchOutputDto,
  SupportedProviders,
  TargetingConditionDto,
  TargetingDto,
} from '@instigo-app/data-transfer-object';
import { ThirdPartyTargetingApiService } from '@instigo-app/third-party-connector';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { User, UserTargetings } from '@prisma/client';
import to from 'await-to-js';
import { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { chunk } from 'lodash';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { AuditLog, LOG_AUDIT } from '../audit_logs/audit_logs.service';
import { PrismaService } from '../prisma/prisma.service';
import { SearchResult, Segment } from '../shared/model';

export const SAVE_FACEBOOK_AUDIENCE = 'save_facebook_audience';
export class SaveFacebookAudienceEvent {
  audience: SearchResult;
  constructor(options: { audience: SearchResult }) {
    this.audience = options.audience;
  }
}

@Injectable()
export class TargetingService {
  @Inject(ThirdPartyTargetingApiService)
  private readonly thirdPartyTargetingApiService: ThirdPartyTargetingApiService;

  @Inject(TargetingHelperService)
  private readonly targetingHelperService: TargetingHelperService;

  @Inject(CACHE_MANAGER)
  private readonly cacheManager: Cache;

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  private readonly logger = new Logger(TargetingService.name);

  constructor(private eventEmitter: EventEmitter2) {}
  search(options: {
    adAccountProviderId: string;
    provider: SupportedProviders;
    accessToken: string;
    searchQuery: string;
    providerSubType: string;
    type: InstigoTargetingTypes;
  }): Promise<SearchOutputDto[]> {
    const { adAccountProviderId, provider, type, accessToken, searchQuery, providerSubType } = options;
    return this.thirdPartyTargetingApiService.search({
      accessToken,
      adAccountProviderId,
      provider,
      searchQuery,
      providerSubType,
      type,
    });
  }

  async reach(options: {
    targeting: TargetingDto;
    accessToken: string;
    adAccountProviderId: string;
  }): Promise<ReachOutputDto> {
    const { targeting, adAccountProviderId, accessToken } = options;
    return await this.thirdPartyTargetingApiService.reach({
      accessToken,
      adAccountProviderId,
      provider: SupportedProviders.FACEBOOK,
      targeting,
    });
  }

  suggestions(options: {
    accessToken: string;
    selected: TargetingConditionDto[];
    adAccountProviderId: string;
  }): Promise<SearchOutputDto[]> {
    const { accessToken, selected, adAccountProviderId } = options;
    return this.thirdPartyTargetingApiService.suggestions({
      accessToken,
      provider: SupportedProviders.FACEBOOK,
      selected,
      adAccountProviderId,
    });
  }

  async browse(options: {
    accessToken: string;
    adAccountProviderId: string;
    limitTypes?: InstigoTargetingTypes[];
  }): Promise<BrowseOutput> {
    const { accessToken, adAccountProviderId, limitTypes } = options;
    const cacheKey = limitTypes ? `browse-facebook-${limitTypes.join(',')}` : `browse-facebook`;
    let result = await this.cacheManager.get(cacheKey);
    if (result) {
      return result;
    }
    result = await this.thirdPartyTargetingApiService.browse({
      accessToken,
      adAccountProviderId,
      limitTypes,
      provider: SupportedProviders.FACEBOOK,
    });
    await this.cacheManager.set(cacheKey, result, { ttl: CacheTtlSeconds.ONE_HOUR });
    return result;
  }

  async saveUserTargeting(options: {
    user: Partial<User>;
    targeting: TargetingDto;
    userTags: string[];
    name: string;
  }): Promise<UserTargetings> {
    const { user, targeting, userTags, name } = options;
    const [spec] = await this.thirdPartyTargetingApiService.convertInstigoAudienceToFacebookAudience({
      audiences: [targeting],
    });
    const toBeInserted: any = this.targetingHelperService.mapFacebookSpecToDBInsert({
      spec: { id: uuidv4() as string, name, targeting: spec } as any,
      userTags,
    });
    const facebookTarget = await this.prismaService.facebookTarget.create({
      data: {
        ...toBeInserted,
      },
    });
    return this.prismaService.userTargetings.create({
      data: {
        userId: user.id,
        targetingId: facebookTarget.id,
      },
    });
  }

  async getSegmentsTargetingStatus(options: {
    targeting: TargetingDto;
    accessToken: string;
    adAccountProviderId: string;
  }): Promise<FacebookTargetingOptionStatus[]> {
    let includesIds = [];
    options.targeting.include?.and?.forEach(({ or }, i) => {
      Object.keys(or).forEach((targetingType) => {
        if (i > 6) {
          const ids = or[targetingType].map((segment) => segment.providerId).filter(Boolean);
          includesIds = [...includesIds, ids];
        }
      });
    });
    let excludedIds = [];
    const excludeOr = options.targeting.exclude.or.or;
    Object.keys(excludeOr).forEach((targetingType) => {
      const ids = excludeOr[targetingType].map((segment) => segment.providerId).filter(Boolean);
      excludedIds = [...excludedIds, ids];
    });
    const ids = [...new Set([...includesIds, ...excludedIds].flat())];
    return await pMap<FacebookTargetingOptionStatus[]>(chunk(ids, 100), async (splittedSegment: Segment[]) => {
      const stringifiedSegment = JSON.stringify(splittedSegment);
      const url = `https://graph.facebook.com/v14.0/search?targeting_option_list=${stringifiedSegment}&type=targetingoptionstatus&access_token=${options.accessToken}`;
      return await this.httpService
        .get(url)
        .pipe(
          map((res: AxiosResponse<{ data: FacebookTargetingOptionStatus[] }>) => res?.data?.data),
          catchError((err) => {
            this.logger.error(`targeting status error: ${err}`);
            return throwError(err as any);
          }),
        )
        .toPromise();
    });
  }

  @OnEvent(SAVE_FACEBOOK_AUDIENCE, { async: true })
  async saveFacebookAudience(payload: SaveFacebookAudienceEvent): Promise<void> {
    const [err, result] = await to(
      this.prismaService.facebookTarget.create({
        data: {
          ...(this.targetingHelperService.mapFacebookSpecToDBInsert({ spec: payload.audience.spec }) as any),
        },
      }),
    );
    this.eventEmitter.emit(LOG_AUDIT, new AuditLog({ context: 'new_facebook_generated_audience', payload: result.id }));
    if (err) {
      this.logger.error('Error saving facebook audience:', err);
    }
  }
}

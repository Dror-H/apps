import { TargetingDto } from '@instigo-app/data-transfer-object';
import { ThirdPartyAudienceApiService } from '@instigo-app/third-party-connector';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import to from 'await-to-js';
import { orderBy, uniqBy } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { SegmentDetailsService } from '../segments/segment-details.service';
import { FacebookTargeting, SearchResult } from '../shared/model';
import { MergeTargetingsService } from '../targeting/merge-targetings.service';
import { SearchFallBackService } from './search-fallback.service';
import { SearchUtils } from './search-utils';
import { SearchRepository } from './search.repository';

@Injectable()
export class SearchService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(ThirdPartyAudienceApiService)
  private readonly thirdPartyAudienceApiService: ThirdPartyAudienceApiService;

  @Inject(SearchFallBackService)
  private readonly searchFallBackService: SearchFallBackService;

  @Inject(SegmentDetailsService)
  private readonly segmentDetailsService: SegmentDetailsService;

  @Inject(SearchRepository)
  private readonly searchRepository: SearchRepository;

  @Inject(MergeTargetingsService)
  private readonly mergeTargetingsService: MergeTargetingsService;

  private logger = new Logger(SearchService.name);

  public async segmentAutoComplete(options: {
    keywords: string | string[];
    limit: number;
  }): Promise<{ id: string; name: string }[]> {
    const { keywords, limit } = options;
    if (!keywords?.length) return [];
    const processedKeywords = Array.isArray(keywords) ? keywords : [keywords];
    const queryKeywords = processedKeywords.map((keyword) => keyword + '%');
    return await this.prismaService.$queryRaw`
    SELECT DISTINCT name
    FROM facebook_segments
    WHERE name ILIKE ANY(ARRAY[${Prisma.join(queryKeywords)}])
    limit ${limit}
    `;
  }

  public async searchByKeywords(options: { keywords: string[]; offset: number }): Promise<SearchResult[]> {
    const { keywords } = options;
    this.logger.log(`Keywords used=>${keywords}`);
    const results = await this.searchRepository.getSpecsByTFIDFKeywords({ keywords, offset: options.offset });
    if (results.length === 0) {
      const [err, facebookFallback] = await to(
        this.searchFallBackService.facebookFallback({
          keywords,
          lowestRank: results[results.length - 1]?.rank - 0.1 || 0.5,
        }),
      );
      results.push(...(!err ? facebookFallback : []));
    }
    return await this.enhanceAudiences(results);
  }

  public async searchByIds(options: { ids: string[] }): Promise<SearchResult[]> {
    const { ids } = options;
    const audiences = await this.searchRepository.getSpecsByIds({ ids });
    if (audiences.length == 0) {
      return [];
    }
    return await this.enhanceAudiences([this.mergeTargetingsService.merge({ audiences })]);
  }

  public async keywordsSuggestions(keywords: string[], ids: string[]): Promise<string[]> {
    if (ids.length === 0 || keywords.length === 0) {
      return [];
    }
    const result = await this.prismaService.$queryRaw<{ tag: string }[]>`
      SELECT
      result.tag
      FROM ( SELECT DISTINCT
        jsonb_array_elements(COALESCE(user_tags, '[]'::jsonb) || jsonb_path_query_array (topics, 'strict $.**.term')) ->> 0 AS tag,
          random() AS INDEX
        FROM
          facebook_targetings
        WHERE
          facebook_targetings.id IN(${Prisma.join(ids)})
          ORDER BY
            INDEX) result
      WHERE
      result.tag NOT in(${Prisma.join(keywords)})
      LIMIT 5`;
    return result.map((r) => r.tag);
  }

  private async enhanceAudiences(audiences: SearchResult[]): Promise<SearchResult[]> {
    audiences = audiences?.map((result) => ({
      id: result.id,
      spec: {
        id: result.spec.id,
        name: result.spec.name,
        targeting: {
          age_max: 65,
          age_min: 18,
          ...(result.createdByContributors
            ? {
                locales: result.spec.targeting.locales,
                geo_locations: result.spec.targeting.geo_locations,
              }
            : { locales: [] }),
          flexible_spec: result.spec.targeting.flexible_spec,
          exclusions: result.spec.targeting.exclusions,
        },
      },
      topics: result.topics,
      userTags: result.userTags || [],
      rank: Number((result.rank * 100).toFixed(0)) - Math.floor(Math.random() * 3),
    }));
    SearchUtils.removeInvalidTypeSegments(audiences);
    await this.segmentDetailsService.appendDetailsOnSegments({ specs: audiences });
    SearchUtils.removeEmptyObjectsAndArraysFromTargeting(audiences);
    this.segmentDetailsService.appendSegmentRatios(audiences);
    const audiencesWithMin5Segments = this.getAudiencesWithMin5Segments(audiences);
    await this.convertAudiences(audiencesWithMin5Segments);
    return orderBy(uniqBy(audiencesWithMin5Segments, 'id'), 'rank', 'desc');
  }

  private getAudiencesWithMin5Segments(audiences: SearchResult[]): SearchResult[] {
    const MIN_SEGMENTS_COUNT = 5;
    const audiencesWithMin5Segments: SearchResult[] = [];

    for (let i = 0; i < audiences.length; i++) {
      const audience = audiences[i];
      const audienceSegmentsCount = SearchUtils.getAudiencesSegments([audience]).length;
      if (audienceSegmentsCount >= MIN_SEGMENTS_COUNT) {
        audiencesWithMin5Segments.push(audience);
      }
    }
    return audiencesWithMin5Segments;
  }

  private async convertAudiences(audiences: SearchResult<FacebookTargeting>[]): Promise<SearchResult<TargetingDto>[]> {
    if (audiences == null) {
      return;
    }
    const coveredAudiences = await this.thirdPartyAudienceApiService.convertFacebookAudienceToInstigoAudience({
      audiences: audiences.map((audience) => audience.spec),
    });
    for (const audience of audiences) {
      const converted = coveredAudiences.find((converted) => converted.providerId === audience.spec.id)?.rules;
      (audience as SearchResult<FacebookTargeting | TargetingDto | any>).spec = converted;
    }
    return audiences as unknown as SearchResult<TargetingDto>[];
  }
}

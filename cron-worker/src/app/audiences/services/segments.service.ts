import { CATEGORY_ID_PREFIX } from '@audiences-api/shared/constants';
import { Segment } from '@audiences-api/shared/model';
import { intUUIDFromString, pMap } from '@instigo-app/api-shared';
import { FacebookTargetingOptionStatus } from '@instigo-app/data-transfer-object';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import to from 'await-to-js';
import { AxiosResponse } from 'axios';
import { chunk, uniqBy } from 'lodash';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ListSqlToken, sql } from 'slonik';
import { Merge } from 'type-fest';
import { DatabaseService } from '../../database/db.service';
import { AdAccountRepository } from './ad-account.repository';

@Injectable()
export class SegmentsService implements OnApplicationBootstrap {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  private readonly logger = new Logger(SegmentsService.name);

  @Inject(AdAccountRepository)
  private readonly adAccountRepository: AdAccountRepository;

  private account: any;

  async onApplicationBootstrap(): Promise<void> {
    const [adAccount] = await this.adAccountRepository.getAnyAdAccount();
    this.logger.log(`Using in the segment service=>${adAccount}`);
    this.account = adAccount;
  }

  filterSegments(details: Segment[]): Segment[] {
    return uniqBy(
      details.map((segment) => {
        if (Object.keys(CATEGORY_ID_PREFIX).includes(segment.type)) {
          return {
            ...segment,
            id: `${CATEGORY_ID_PREFIX[segment?.type]}${
              segment?.id || intUUIDFromString(`${segment.name}${segment.description}`)
            }`,
          };
        }
        return segment;
      }),
      'id',
    )
      .filter((detail) => detail.id)
      .filter((detail) => detail.name);
  }

  private mapToInsertValues(mapped: Segment[]): ListSqlToken {
    const getCategory = (row: Segment & { category: string }): string => {
      if (row?.type) {
        return row?.type?.toLowerCase();
      }
      if (row?.category) {
        return row?.category;
      }
      return row?.path && row?.path[0] ? row?.path[0]?.toLowerCase() : null;
    };

    return sql.join(
      mapped.map(
        (row) => sql`(
            ${row.id},
            ${row.name || null},
            ${row?.description || null},
            ${row?.disambiguation_category || null},
            ${getCategory(row as any) || null},
            ${row?.topic || null},
            ${row?.audience_size_lower_bound || 0},
            ${row?.audience_size_upper_bound || 0},
            ${JSON.stringify(row?.path) || null},
            ${JSON.stringify(row?.relatedWords) || null},
            ${JSON.stringify(row?.synonyms) || null},
            ${JSON.stringify(row?.datamuse) || null},
            ${row?.status || null})`,
      ),
      sql`,`,
    );
  }

  public async saveSegmentsDetails(details: Segment[]): Promise<number> {
    if (!details || details.length === 0) {
      return 0;
    }
    const mapped = this.filterSegments(details);
    const values = this.mapToInsertValues(mapped);

    const insert = sql`
    INSERT INTO facebook_segments (
    id,
    name,
    description,
    disambiguation_category,
    category,
    topic,
    audience_size_lower_bound,
    audience_size_upper_bound,
    path,
    related_words,
    synonyms,
    datamuse,
    status
    ) VALUES ${values}
    ON CONFLICT (id) DO UPDATE SET (
      name,
      description,
      disambiguation_category,
      category,
      topic,
      audience_size_lower_bound,
      audience_size_upper_bound,
      path,
      related_words,
      synonyms,
      datamuse,
      status
    ) = (
      COALESCE(EXCLUDED.name, facebook_segments.name),
      COALESCE(EXCLUDED.description, facebook_segments.description),
      COALESCE(EXCLUDED.disambiguation_category, facebook_segments.disambiguation_category),
      COALESCE(EXCLUDED.category, facebook_segments.category),
      COALESCE(EXCLUDED.topic, facebook_segments.topic),
      COALESCE(EXCLUDED.audience_size_lower_bound, facebook_segments.audience_size_lower_bound),
      COALESCE(EXCLUDED.audience_size_upper_bound, facebook_segments.audience_size_upper_bound),
      COALESCE(EXCLUDED.path, facebook_segments.path),
      COALESCE(EXCLUDED.related_words, facebook_segments.related_words),
      COALESCE(EXCLUDED.synonyms, facebook_segments.synonyms),
      COALESCE(EXCLUDED.datamuse, facebook_segments.datamuse),
      COALESCE(EXCLUDED.status, facebook_segments.status)
      )
    RETURNING id
   `;

    const [specSaveErr, insertedCount] = await to(this.databaseService.audiences.query(sql`${insert}`));
    if (specSaveErr) {
      this.logger.error(specSaveErr);
      return 0;
    }
    return insertedCount.rowCount;
  }

  public async getSegmentDetails(options: { segment: Pick<Segment, 'id'> }): Promise<Segment[]> {
    const { segment } = options;
    const url = `https://graph.facebook.com/v14.0/${segment.id}?access_token=${this.account.access_token}`;
    return await this.httpService
      .get(url)
      .pipe(
        map((res: AxiosResponse<Segment>) => [res.data]),
        catchError((e) => {
          this.logger.debug(e);
          return EMPTY;
        }),
      )
      .toPromise();
  }

  public async searchSegmentDetails(options: {
    segment: { name: string };
    account?: { id: string; access_token: string };
  }): Promise<Segment[]> {
    const { segment } = options;
    const account = options.account || this.account;
    const url = `https://graph.facebook.com/v14.0/${account.id}/targetingsearch?q=${encodeURI(
      segment.name,
    )}&access_token=${account.access_token}`;
    return await this.httpService
      .get(url)
      .pipe(
        map((res: AxiosResponse<{ data: Segment[] }>) => res.data.data),
        catchError((e) => {
          this.logger.debug(e);
          return EMPTY;
        }),
      )
      .toPromise();
  }

  async getSegmentsTargetingValidation(options: {
    segments: Pick<Segment, 'id' | 'type' | 'name'>[];
    account?: { id: string; access_token: string };
  }): Promise<Segment[]> {
    const { segments } = options;
    const account = options.account || this.account;
    const validatedSegments = await pMap<Merge<Segment, { valid: boolean }>[]>(
      chunk(segments, 100),
      async (splittedSegment: Segment[]) => {
        const stringifiedSegment = JSON.stringify(splittedSegment.map(({ id, type }) => ({ id, type })));
        const url = `https://graph.facebook.com/v14.0/${account.id}/targetingvalidation?targeting_list=${stringifiedSegment}&access_token=${account.access_token}`;
        return await this.httpService
          .get(url)
          .pipe(
            map((res: AxiosResponse<{ data: Merge<Segment, { valid: boolean }>[] }>) => res?.data?.data),
            catchError((err) => []),
          )
          .toPromise();
      },
    );
    return validatedSegments?.filter((item) => item && item?.valid) || [];
  }

  async getSegmentsTargetingStatus(options: {
    segments: Pick<Segment, 'id'>[];
    account?: { id: string; access_token: string };
  }): Promise<FacebookTargetingOptionStatus[]> {
    const segmentIds = options.segments.map(({ id }) => id);
    const account = options.account || this.account;
    return await pMap<FacebookTargetingOptionStatus[]>(chunk(segmentIds, 100), async (splittedSegment: Segment[]) => {
      const stringifiedSegment = JSON.stringify(splittedSegment);
      const url = `https://graph.facebook.com/v14.0/search?targeting_option_list=${stringifiedSegment}&type=targetingoptionstatus&access_token=${account.access_token}`;
      return await this.httpService
        .get(url)
        .pipe(
          map((res: AxiosResponse<{ data: FacebookTargetingOptionStatus[] }>) => res?.data?.data),
          catchError((err) => []),
        )
        .toPromise();
    });
  }

  public async targetingBrowse(options?: { account?: { id: string; access_token: string } }): Promise<Segment[]> {
    const account = options?.account || this.account;
    const { id, access_token } = account;
    const browse: Merge<Segment, { raw_name: string }>[] = await this.httpService
      .get(`https://graph.facebook.com/v14.0/${id}/targetingbrowse?access_token=${access_token}`)
      .pipe(
        map((res: AxiosResponse<{ data: Merge<Segment, { raw_name: string }>[] }>) => res.data.data),
        catchError(() => EMPTY),
      )
      .toPromise();

    return browse?.map((item) => ({ ...item, name: item?.raw_name || item?.name })) || [];
  }

  public async targetingOptions(options?: { account?: { id: string; access_token: string } }): Promise<Segment[]> {
    const account = options?.account || this.account;
    const { access_token } = account;
    const classes = [
      'interests',
      'behaviors',
      'demographics',
      'life_events',
      'industries',
      'income',
      'family_statuses',
      'user_device',
      'user_os',
    ];
    return await classes.reduce(async (acc, className) => {
      const data: Merge<Segment, { raw_name: string }>[] = await this.httpService
        .get(
          `https://graph.facebook.com/v14.0/search?type=adTargetingCategory&class=${className}&access_token=${access_token}`,
        )
        .pipe(
          map((res: AxiosResponse<{ data: Merge<Segment, { raw_name: string }>[] }>) => res.data.data),
          catchError(() => EMPTY),
        )
        .toPromise();
      return [...(await acc), ...(data || [])];
    }, Promise.resolve([]));
  }
}

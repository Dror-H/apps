import { Segment, SynonymsResponse } from '@audiences-api/shared/model';
import { ProgressBar, waitAllSettled } from '@instigo-app/api-shared';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import PromisePool from '@supercharge/promise-pool';
import to from 'await-to-js';
import { AxiosResponse } from 'axios';
import { chunk, flatten, compact } from 'lodash';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/operators';
import { sql } from 'slonik';
import { DatabaseService } from '../../database/db.service';
import { SegmentsService } from '../services/segments.service';

const ALLOWED_TYPES = [
  'interests',
  'education_statuses',
  'education_schools',
  'education_majors',
  'work_positions',
  'work_employers',
  'interested_in',
  'relationship_statuses',
  'college_years',
  'family_statuses',
  'industries',
  'life_events',
  'political_views',
  'politics',
  'behaviors',
  'income',
  'net_worth',
  'home_type',
  'home_ownership',
  'home_value',
  'ethnic_affinity',
  'generation',
  'household_composition',
  'moms',
  'office_type',
  'user_adclusters',
];

@Injectable()
export class SeedSegmentsService {
  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Inject(SegmentsService)
  private readonly segmentsService: SegmentsService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  private logger = new Logger();

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'seed-segments' })
  async seed(): Promise<void> {
    await to(this.getTargetingBrowseAndOptions());
    const segments = await this.getSegments();
    await this.searchForDetails(segments);
  }

  private async getTargetingBrowseAndOptions(): Promise<void> {
    const targetingBrowse = await this.segmentsService.targetingBrowse();
    const targetingOptions = await this.segmentsService.targetingOptions();
    await this.segmentsService.saveSegmentsDetails([...targetingBrowse, ...targetingOptions]);
  }

  private async searchForDetails(segments: Pick<Segment, 'id' | 'name'>[]): Promise<void> {
    const progress = new ProgressBar({ total: segments.length, identifier: 'seed-segments' });
    const { results: toBeInserted } = await new PromisePool()
      .for(segments)
      .withConcurrency(500)
      .process(async (segment) => {
        const searchAndDetails = await waitAllSettled<Segment[]>(
          [this.segmentsService.searchSegmentDetails({ segment }), this.segmentsService.getSegmentDetails({ segment })],
          { concat: true },
        );
        progress.tick();
        const filtered = [...searchAndDetails.filter((d) => d !== undefined)];
        if (filtered && filtered.length > 0) {
          const detail = filtered.find((f) => f.id === segment.id);
          return [...filtered, ...[detail ? null : segment]];
        }
        return [segment];
      });
    for (const checked of chunk(compact(flatten(toBeInserted)), 10000)) {
      const saved = await this.segmentsService.saveSegmentsDetails(checked as Segment[]);
      this.logger.log(`Saved ${saved} segments`);
    }
  }

  async getSegments(): Promise<Pick<Segment, 'id' | 'name'>[]> {
    const result = await this.databaseService.audiences.many<Pick<Segment, 'id' | 'name'>>(sql`
    SELECT DISTINCT ON (id)
    trim('"' FROM id::text) AS id,
    trim('"' FROM name::text) AS name
  FROM ( SELECT DISTINCT
      concat(id, '') AS id,
      concat((array_agg(name)) [1], '') AS name
    FROM (
      SELECT
        jsonb_path_query (spec,
          '$.targeting.**.**.id') AS id,
        jsonb_path_query (spec,
          '$.targeting.**.**.name') AS name
      FROM
        facebook_targetings) result
    WHERE
      id IS NOT NULL
    GROUP BY
      result.id
    UNION
    SELECT DISTINCT
      concat(payload ->> 'id'::text, '') AS id,
      concat(payload ->> 'name'::text, '') AS name
    FROM
      audit_logs
    LEFT JOIN facebook_segments ON facebook_segments.id = payload ->> 'id'
  WHERE
    context = 'missing_segment_details'
    AND facebook_segments.id IS NULL) u;`);
    return result.slice();
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM, { name: 'refresh-segments' })
  async refreshSegments(): Promise<void> {
    const total = await this.databaseService.audiences.oneFirst<number>(sql`SELECT COUNT(*) FROM facebook_segments`);
    const last = await this.databaseService.audiences.oneFirst<number>(
      sql`SELECT id from facebook_segments order by id desc LIMIT 1;`,
    );
    const takeEach = 2000;
    const progress = new ProgressBar({
      total: total / takeEach < 1 ? 2 : Math.trunc(total / takeEach),
      identifier: 'refresh-segments',
    });
    let cursor = null;
    do {
      const segments = await this.databaseService.audiences.many<Segment & { category: string }>(sql`
      SELECT
      id,
      name,
      audience_size_lower_bound,
      audience_size_upper_bound,
      category,
      description,
      disambiguation_category,
      path,
      related_words as "relatedWords",
      status,
      synonyms,
      topic,
      datamuse
       FROM facebook_segments   ${cursor ? sql`where id > ${cursor}` : sql``} order by id asc limit ${takeEach}`);

      cursor = segments.length > 0 ? segments[segments.length - 1].id : null;
      this.logger.log(`Running ${cursor} from ${last}`);

      const segmentsStatus = await this.segmentsService.getSegmentsTargetingStatus({
        segments: segments.filter(
          (s) => !['education_statuses', 'college_years', 'relationship_statuses'].includes(s.category),
        ),
      });
      const segmentsValidation = await this.segmentsService.getSegmentsTargetingValidation({
        segments: segments
          .map((s) => ({ id: s.id, name: s.name, type: s.category }))
          .filter((s) => ALLOWED_TYPES.includes(s.type)),
      });
      const { results, errors } = await new PromisePool()
        .for(segments.slice())
        .withConcurrency(1000)
        .process(async (segment) => {
          const [, searchResult = []] = await to(this.segmentsService.searchSegmentDetails({ segment }));
          const [, relatedWords = []] = await to(this.getSegmentRelatedWords(segment));
          const [, synonyms = []] = await to(this.getSegmentSynonyms(segment));
          const [, datamuse = []] = await to(this.getSegmentDataMuse(segment));
          const [detail] = (await this.segmentsService.getSegmentDetails({ segment })) || [];
          const status = segmentsStatus.find((s) => segment.id === s?.id)?.current_status || null;
          const validation = segmentsValidation.find((s) => segment.id === s?.id);
          const search = searchResult.find((s) => s.id === segment.id);
          return this.mapSegment(segment, search, detail, validation, relatedWords, synonyms, datamuse, status);
        });
      progress.tick();
      if (errors && errors.length > 0) {
        this.logger.error(`We got ${errors.length} errors`);
      }
      if (results.length > 0) {
        await this.segmentsService.saveSegmentsDetails(results);
      }
    } while (cursor !== null);
  }

  mapSegment(
    segment: any,
    search: Segment,
    detail: Segment,
    validation: Segment,
    relatedWords: string[],
    synonyms: string[],
    datamuse: string[],
    status: string,
  ): Segment {
    return {
      id: segment.id,
      name: detail?.name || validation?.name || search?.name || segment.name,
      audience_size_lower_bound:
        detail?.audience_size_lower_bound ||
        validation?.audience_size_lower_bound ||
        search?.audience_size_lower_bound ||
        segment?.audience_size_lower_bound,
      audience_size_upper_bound:
        detail?.audience_size_upper_bound ||
        validation?.audience_size_upper_bound ||
        search?.audience_size_upper_bound ||
        segment?.audience_size_upper_bound,
      path: detail?.path || validation?.path || search?.path || segment?.path,
      description: detail?.description || validation?.description || search?.description || segment?.description,
      topic: detail?.topic || validation?.topic || segment?.topic,
      type: detail?.type || validation?.type || search?.type || segment?.category,
      disambiguation_category: detail?.disambiguation_category || validation?.disambiguation_category,
      relatedWords: relatedWords || segment?.related_words,
      synonyms: synonyms || segment?.synonyms,
      datamuse: datamuse || segment?.datamuse,
      status,
    };
  }

  private async getSegmentRelatedWords(segment: Pick<Segment, 'id' | 'name'>): Promise<string[]> {
    return await this.httpService
      .get(` https://relatedwords.org/api/related?term=${segment.name}`)
      .pipe(
        map((response: AxiosResponse<any>) => response.data.map((i) => i?.word).slice(0, 20)),
        catchError((e) => {
          this.logger.debug(e);
          return [];
        }),
      )
      .toPromise();
  }

  private async getSegmentDataMuse(segment: Pick<Segment, 'id' | 'name'>): Promise<string[]> {
    return await this.httpService
      .get(` https://api.datamuse.com/words?ml=${segment.name}&max=20`)
      .pipe(
        map(
          (
            response: AxiosResponse<
              {
                word: string;
                score: number;
              }[]
            >,
          ) => response.data.map((i) => i?.word),
        ),
        catchError((e) => {
          this.logger.debug(e);
          return [];
        }),
      )
      .toPromise();
  }

  private getSegmentSynonyms(segment: Pick<Segment, 'id' | 'name'>): Promise<string[]> {
    return this.httpService
      .post(
        `https://api.explosion.ai/sense2vec2/find`,
        {
          word: segment.name,
          sense: 'NOUN',
          model: '2019',
        },
        { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } },
      )
      .pipe(
        map((response: AxiosResponse<SynonymsResponse>) => response.data.results.map((s) => s.text).slice(0, 20)),
        catchError((e) => {
          this.logger.debug(e);
          return [];
        }),
      )
      .toPromise();
  }
}

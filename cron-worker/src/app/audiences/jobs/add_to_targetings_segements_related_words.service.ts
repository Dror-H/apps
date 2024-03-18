import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { sql } from 'slonik';
import { DatabaseService } from '../../database/db.service';
import { RebuildIndexService } from './rebuild-index.service';
import PromisePool from '@supercharge/promise-pool';

@Injectable()
export class AddToTargetingsSegmentsRelatedWordsService {
  private logger = new Logger(RebuildIndexService.name);

  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Cron(CronExpression.EVERY_DAY_AT_3AM, { name: 'add-to-targetings-segments-related-words' })
  async addRelatedWords(): Promise<void> {
    this.logger.log('addRelatedWords');
    const { rows } = await this.databaseService.audiences.query<{ id: string; segment_ids: string[] }>(sql`
        SELECT
      id,
      TRANSLATE(jsonb_path_query_array (spec, 'strict $.targeting.**.id')::text, '[]', '{}')::TEXT AS segment_ids
      FROM
      facebook_targetings;
`);
    await new PromisePool()
      .for(rows as any[])
      .withConcurrency(500)
      .process(async (targeting: { id: string; segment_ids: string[] }, index) => {
        const { rows: related_words } = await this.databaseService.audiences.query<{
          related_words: string;
        }>(sql`
      SELECT DISTINCT
      jsonb_array_elements(related_words || synonyms || datamuse) AS related_words
      FROM
      facebook_segments
      WHERE
      id in (${sql.join(targeting.segment_ids, sql`, `)})
      `);
        const related_words_clean = related_words.map((r) => r?.related_words);
        await this.databaseService.audiences.query(
          sql`UPDATE facebook_targetings SET segments_related_words=${sql.jsonb(related_words_clean)} where id=${
            targeting.id
          }`,
        );
        this.logger.log(`Running ${index} from ${rows.length}`);
      });
  }
}

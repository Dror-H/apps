import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import to from 'await-to-js';
import { sql } from 'slonik';
import { DatabaseService } from '../../database/db.service';

@Injectable()
export class RebuildIndexService {
  private logger = new Logger(RebuildIndexService.name);

  @Inject(DatabaseService)
  private readonly databaseService: DatabaseService;

  @Cron(CronExpression.EVERY_4_HOURS, { name: 'rebuild-index' })
  async rebuildIndex(): Promise<void> {
    this.logger.log('rebuildIndex');
    await to(
      this.databaseService.audiences.query(sql`
      WITH numbered AS (
        SELECT
          id,
          row_number() OVER (ORDER BY id) AS rn
        FROM
          facebook_targetings
      )
      UPDATE
        facebook_targetings
      SET
        search_vector = vector.val
      FROM (
      SELECT
        selection.id,
        setweight(to_tsvector(coalesce(user_tags::text, '')), 'A') ||
        setweight(to_tsvector(jsonb_path_query_array (topics, 'strict $.**.term')::text), 'A') ||
        setweight(to_tsvector(coalesce(segments::text, '')), 'B') ||
        setweight(to_tsvector(coalesce(segments_related_words::text, '')), 'C') AS val
      FROM
        facebook_targetings selection) vector
      WHERE
        vector.id = facebook_targetings.id;`),
    );

    await to(
      this.databaseService.audiences.query(sql`
        WITH numbered AS (
          SELECT
            id,
            row_number() OVER (ORDER BY id) AS rn
          FROM
            facebook_segments
        )
        UPDATE
          facebook_segments
        SET
          search_vector = vector.val
        FROM (
        SELECT
          selection.id,
          setweight(to_tsvector(coalesce(selection.name, '')), 'A') || setweight(to_tsvector(coalesce(selection.related_words::text, '')), 'A') || setweight(to_tsvector(coalesce(selection.synonyms::text, '')), 'A') || setweight(to_tsvector(coalesce(selection.datamuse::text, '')), 'A') AS val
        FROM
          facebook_segments selection) vector
        WHERE
          vector.id = facebook_segments.id;`),
    );

    await to(
      this.databaseService.audiences.query(sql`
    UPDATE
    facebook_targetings
  SET
    segments_vector_norm = pgml_norm_l2 (segments_vector),
    combined_topics_vector_norm = pgml_norm_l2 (combined_topics_vector)
  WHERE
    jsonb_array_length(segments) > 5
    AND combined_topics_vector IS NOT NULL
    AND segments_vector IS NOT NULL
    AND pgml_norm_l2 (combined_topics_vector) > 0
    AND pgml_norm_l2 (segments_vector) > 0;`),
    );
  }
}

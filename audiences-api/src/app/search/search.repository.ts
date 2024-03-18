import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import to from 'await-to-js';
import { flatten } from 'lodash';
import { PrismaService } from '../prisma/prisma.service';
import { SearchResult } from '../shared/model';

@Injectable()
export class SearchRepository {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(HttpService)
  private readonly httpService: HttpService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;
  private logger = new Logger(SearchRepository.name);

  public async getSpecsByMlKeywords(options: { keywords: string[]; offset: number }): Promise<SearchResult[]> {
    const { keywords, offset = 0 } = options;
    const limit = 30;

    const { data: keywordsVector } = await this.httpService
      .get(
        `${this.configService.get<string>('ML_HOST')}/convert_keywords/?${keywords
          .map((keyword) => `q=${encodeURIComponent(keyword)}`)
          .join('&')}`,
      )
      .toPromise();

    const results: any[] = await this.prismaService.$queryRaw<any[]>`
    SELECT * , (result.segment_rank + result.combined_topics_rank) / 2 as rank
    FROM (
           SELECT facebook_targetings.id as id,
                  spec,
                  segments,
                  user_tags as "userTags",
                  jsonb_path_query_array(topics, 'strict $.**.term')::json as topics,
                  pgml_cosine_similarity(${keywordsVector}, segments_vector, pgml_norm_l2(${keywordsVector}), segments_vector_norm) as segment_rank,
                  pgml_cosine_similarity(${keywordsVector}, combined_topics_vector, pgml_norm_l2(${keywordsVector}), combined_topics_vector_norm) as combined_topics_rank
           FROM facebook_targetings
           WHERE spec->>'name'!='FACEBOOK GENERATED' and jsonb_array_length(segments)>5
           and combined_topics_vector_norm > 0 and segments_vector_norm > 0
           ) as result
     WHERE result.segment_rank>0 and result.combined_topics_rank>0
     ORDER BY (segment_rank + combined_topics_rank) / 2 DESC
     LIMIT ${limit}::int OFFSET ${offset}::int`;
    return results;
  }

  public async getSpecsByTFIDFKeywords(options: { keywords: string[]; offset: number }): Promise<SearchResult[]> {
    const { keywords, offset = 0 } = options;
    const limit = 15;
    const query = Prisma.sql`SELECT *
    from (
       SELECT facebook_targetings.id as id,
              spec,
              segments,
              user_tags as "userTags",
              jsonb_path_query_array(topics, 'strict $.**.term')::json as topics,
              ts_rank(search_vector, websearch_to_tsquery(${`"${keywords.join(`" or "`)}"`})) as rank,
              TRANSLATE(jsonb_path_query_array (spec, 'strict $.targeting.**.id')::text, '[]', '{}')::TEXT [] && (
                SELECT
                  array_agg(id)
                FROM (SELECT DISTINCT
                    id,
                    name,
                    ts_rank_cd(search_vector, websearch_to_tsquery (${`"${keywords.join(`" or "`)}"`})) AS rank
                  FROM
                    facebook_segments
                  ORDER BY
                    rank DESC) result
                WHERE
                  result.rank > 0.5)::text[] AS similarity
       FROM facebook_targetings
       where spec->>'name'!='FACEBOOK GENERATED' and jsonb_array_length(segments)>5
       ORDER BY rank DESC) as result
       WHERE rank > 0.1 order by similarity desc
       LIMIT ${limit}::int OFFSET ${offset}::int`;
    const [err, results] = await to(this.prismaService.$queryRaw<SearchResult[]>`${query}`);
    if (err) {
      this.logger.error(err);
      return [];
    }
    return flatten<SearchResult>(results);
  }

  public async getSpecsByIds(options: { ids: string[] }): Promise<SearchResult[]> {
    const { ids } = options;
    return await this.prismaService.$queryRaw<SearchResult[]>`
       SELECT facebook_targetings.id as id,
       CASE
        WHEN user_targetings.user_id IS NOT NULL
            and users.is_admin THEN TRUE
        ELSE FALSE
       END AS "createdByContributors",
       spec,
       segments,
       user_tags as "userTags",
       jsonb_path_query_array(topics, 'strict $.**.term')::json as topics
       FROM facebook_targetings
       LEFT JOIN user_targetings on facebook_targetings.id = user_targetings.targeting_id
       LEFT JOIN users on users.id = user_targetings.user_id
       WHERE facebook_targetings.id IN (${Prisma.join(ids)})`;
  }
}

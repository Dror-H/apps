import { CondOperator, RequestQueryBuilder } from '@nestjsx/crud-request';

export function getOneCampaignQuery(campaignId: string): string {
  const qb = RequestQueryBuilder.create();
  const query = qb.setFilter({ field: 'id', operator: CondOperator.EQUALS, value: campaignId }).setLimit(1).setPage(1);
  return query.query();
}

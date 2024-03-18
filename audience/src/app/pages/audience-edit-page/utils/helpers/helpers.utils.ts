import { SearchResult } from '@instigo-app/data-transfer-object';
import { flatten } from 'lodash';

export function getAudiencesFlatValues(audiences: SearchResult[], key: 'topics' | 'userTags'): string[] {
  if (!audiences?.length) {
    return [];
  }
  return flatten(audiences.filter((a) => !!a[key]).map((audience) => audience[key]));
}

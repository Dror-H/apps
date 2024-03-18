import { filterDuplicatesExceptLast } from '@instigo-app/ui/shared';

export function getSanitizedSearchHistory(searchHistory: string[], maxValues = 5): string[] {
  return filterDuplicatesExceptLast(searchHistory).slice(-maxValues);
}

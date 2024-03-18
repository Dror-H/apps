import { has } from 'lodash-es';

export function isRowSelection(payload) {
  return !has(payload, 'page');
}

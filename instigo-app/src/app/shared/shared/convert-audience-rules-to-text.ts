import {
  AudienceRuleDto,
  AudienceRulesComparisonOperators,
  AudienceRulesSetDto,
} from '@instigo-app/data-transfer-object';
import { Operators } from '@instigo-app/data-transfer-object';

export function convertAudienceRulesToText(rules: AudienceRulesSetDto, scope: 'include' | 'exclude'): string {
  const sentence = `${rules.operator.toUpperCase()}\r\n`;
  return convertRulesSetToText(rules[scope], sentence);
}

function convertRulesSetToText(rules: AudienceRulesSetDto[], sentence = ''): string {
  return rules.reduce((acc, rule) => {
    acc += '\t';
    for (const key in rule) {
      let value = '';
      switch (key) {
        case 'urls': {
          value = getUrls(rule[key]);
          break;
        }
        case 'frequency': {
          value = getFrequency(rule[key]);
          break;
        }
        case 'devices': {
          value = getDevices(rule[key]);
          break;
        }
        default: {
          value = rule[key];
        }
      }
      acc += `${key}: ${value}\n\t`;
    }
    acc += '\r\n';
    return acc;
  }, sentence);
}

function getDevices(devices: string[]): string {
  return devices.reduce((acc, item) => (acc += `${item},`), '');
}

function getFrequency(frequency: { operator: string; value: number }): string {
  return `${frequency.operator} ${frequency.value}`;
}

function getUrls(urls: { operator: string; value: string }[]): string {
  return urls.reduce((result, item) => (result += item.operator + ' ' + item.value + '; '), '');
}

export function convertAudienceRulesToTextTable(rules: AudienceRuleDto | AudienceRulesSetDto): string {
  const sentence = `${rules.condition.toUpperCase()}\r\n`;
  return convertRulesSetToTextTable(rules.rules, sentence);
}

function convertRulesSetToTextTable(rules: AudienceRulesSetDto[], sentence = ''): string {
  return rules.reduce((acc, rule) => {
    if (!rule.rules && (!rule.field || !rule.value)) {
      return acc;
    }
    return rule.rules
      ? `${acc} ${getTabs(rule.depth)}${convertAudienceRulesToTextTable(rule)}`
      : `${acc} ${getTabs(rule.depth)}${rule.field} ${convertOperatorToTextTable(rule.operator)} ${rule.value}\r\n`;
  }, sentence);
}

function convertOperatorToTextTable(operator: string): string {
  switch (operator) {
    case AudienceRulesComparisonOperators.CONTAINS:
      return 'containing';
    case AudienceRulesComparisonOperators.STARTS_WITH:
      return 'starting with';
    case Operators.EQUALS:
      return ':';
    case 'eq':
      return ':';
    default:
      return '';
  }
}

function getTabs(depth: number): string {
  return Array.from(Array(depth), () => `\t`).join('');
}

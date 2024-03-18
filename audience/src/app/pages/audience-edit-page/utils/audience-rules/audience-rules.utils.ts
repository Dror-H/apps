import { initFacebookTargetingRules } from '@audience-app/pages/audience-edit-page/mocks';
import { TargetingAndDto, TargetingDto } from '@instigo-app/data-transfer-object';
import { cloneDeep } from 'lodash';

export function createRulesFromTargeting(targeting?: TargetingDto): TargetingDto {
  if (!targeting) {
    return null;
  }

  const includeRules = getRulesWithDetailedTargeting(targeting);
  const targetingCopy = cloneDeep(targeting);
  targetingCopy.include.and = includeRules;

  return targetingCopy;
}

export function getRulesWithDetailedTargeting(targeting: TargetingDto): TargetingAndDto[] {
  const ands = targeting.include.and;
  const ageRange = ands[0].or;
  const locales = ands[1].or;
  const locationData = ands[2].or; //* can be non-existent

  const rules = initFacebookTargetingRules;
  if (locationData.locationTypes) {
    rules[0].or = locationData;
  }
  rules[1].or = ageRange;
  rules[3].or = locales;

  const detailedTargeting = getSelectedAudienceDetailedTargeting(targeting, !!locationData.locationTypes);
  return [...rules, ...detailedTargeting];
}

export function getSelectedAudienceDetailedTargeting(
  targeting: TargetingDto,
  hasLocationData: boolean,
): TargetingAndDto[] {
  return targeting.include.and.slice(hasLocationData ? 3 : 2);
}

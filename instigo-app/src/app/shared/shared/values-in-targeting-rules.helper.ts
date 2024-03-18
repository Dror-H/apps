import {
  AudienceDto,
  InstigoTargetingTypes,
  SearchOutputDto,
  TargetingAndDto,
  TargetingConditionDto,
  TargetingDto,
} from '@instigo-app/data-transfer-object';

export function getCustomAudiences(values: any): { include: AudienceDto[]; exclude: AudienceDto[] } {
  return values;
}

export function getGender(values: any): '0' | '1' | '2' {
  return values[0].providerId[0];
}

export function getLocales(values: SearchOutputDto | null): string[] {
  const locales = values[0]?.providerId;
  if (!locales?.length || isNaN(parseInt(locales))) {
    return ['6']; //* default to english
  }
  return locales;
}

export function getAgeRange(values: any): { fromAge: number; toAge: number } {
  const ageString: string = values[0].providerId;
  const ages = ageString.substring(1, ageString.length - 1).split(',');
  return { fromAge: parseInt(ages[0]), toAge: parseInt(ages[1]) };
}

export function getTargetingOptimization(values: any): boolean {
  return values[0].providerId;
}

export function getCountries(locations: SearchOutputDto[]): SearchOutputDto[] {
  return locations;
}

export function getCities(locations: SearchOutputDto[]): SearchOutputDto[] {
  return locations;
}

export function generalFields(generalField: TargetingConditionDto[]): TargetingConditionDto[] {
  return generalField;
}

export function getRegions(locations: SearchOutputDto[]): SearchOutputDto[] {
  return locations;
}

export function getLocationType(values: { providerId: string }[]): { providerId: string }[] {
  return values;
}

export function getFacebookConnections(values: {
  connected: string[];
  friendsConnected: string[];
  excluded: string[];
}): { connected: string[]; friendsConnected: string[]; excluded: string[] } {
  return values;
}

export function extractValueFromRules(
  rules: TargetingDto,
  key: InstigoTargetingTypes,
  includedOrExcluded: 'include' | 'exclude' = 'include',
) {
  const extractValuesFor = {
    // todo - check types, locales providerId expects type string but receives string[]
    [InstigoTargetingTypes.AGE_RANGE]: (values: (SearchOutputDto | TargetingConditionDto)[]) => getAgeRange(values),
    [InstigoTargetingTypes.GENDERS]: (values: (SearchOutputDto | TargetingConditionDto)[]) => getGender(values),
    [InstigoTargetingTypes.LOCALES]: (values: SearchOutputDto) => getLocales(values),
    [InstigoTargetingTypes.INTERESTS]: (values: (SearchOutputDto | TargetingConditionDto)[]) => generalFields(values),
    [InstigoTargetingTypes.BEHAVIORS]: (values: (SearchOutputDto | TargetingConditionDto)[]) => generalFields(values),
    [InstigoTargetingTypes.DEMOGRAPHICS]: (values: (SearchOutputDto | TargetingConditionDto)[]) =>
      generalFields(values),
    [InstigoTargetingTypes.TARGETING_OPTIMIZATION]: (values: (SearchOutputDto | TargetingConditionDto)[]) =>
      getTargetingOptimization(values),
    [InstigoTargetingTypes.CUSTOM_AUDIENCES]: (values: (SearchOutputDto | TargetingConditionDto)[]) =>
      getCustomAudiences(values),
    [InstigoTargetingTypes.FACEBOOK_CONNECTIONS]: (values: (SearchOutputDto | TargetingConditionDto)[]) =>
      getFacebookConnections(values as any),
  };
  let values;
  if (includedOrExcluded === 'include') {
    rules[includedOrExcluded].and.forEach((and: TargetingAndDto) => {
      if (and.or[key]) {
        values = extractValuesFor[key](and.or[key]);
      }
    });
    if (values || values === false) {
      return values;
    }
  }

  if (includedOrExcluded === 'exclude') {
    if (rules[includedOrExcluded].or[key]) {
      values = extractValuesFor[key](rules[includedOrExcluded].or[key]);
    }
    if (values || values === false) {
      return values;
    }
  }
  return null;
}

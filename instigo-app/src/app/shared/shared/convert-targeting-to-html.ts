import {
  InstigoTargetingTypes,
  SearchOutputDto,
  TargetingConditionDto,
  TargetingOrDto,
} from '@instigo-app/data-transfer-object';
import { isFunction, startCase } from 'lodash-es';

const parsers = {
  [InstigoTargetingTypes.AGE_RANGE]: (values: (SearchOutputDto | TargetingConditionDto)[]) => getAge(values),
  [InstigoTargetingTypes.GENDERS]: (values: (SearchOutputDto | TargetingConditionDto)[]) => getGender(values),
  [InstigoTargetingTypes.LOCATION_TYPES]: (values: (SearchOutputDto | TargetingConditionDto)[]) =>
    getLocationType(values),
  [InstigoTargetingTypes.CITIES]: (values: (SearchOutputDto | TargetingConditionDto)[]) => getCities(values),
  [InstigoTargetingTypes.REGIONS]: (values: (SearchOutputDto | TargetingConditionDto)[]) => getRegions(values),
  [InstigoTargetingTypes.ZIPS]: (values: (SearchOutputDto | TargetingConditionDto)[]) => getZips(values),
  [InstigoTargetingTypes.CUSTOM_AUDIENCES]: (values: (SearchOutputDto | TargetingConditionDto)[]) =>
    getCustomAudiences(values),
  [InstigoTargetingTypes.FACEBOOK_CONNECTIONS]: () => '',
};

export function convertTargetingOrList(or: TargetingOrDto): string {
  return Object.entries(or).reduce((innerHTML, [key, value]: [InstigoTargetingTypes, TargetingConditionDto[]]) => {
    innerHTML += `<strong>${startCase(key)}: </strong>${value.length == null ? '' : '(' + value.length + ')'} <ul>`;
    if (isFunction(parsers[key])) {
      innerHTML += `${parsers[key](value)}`;
    } else {
      innerHTML += value.reduce(
        (acc, current) => (acc += `<li class="ml-25">${current.name || current.providerId}</li>`),
        ``,
      );
    }
    innerHTML += `</ul>`;
    return innerHTML;
  }, ``);
}

function getAge(values: (SearchOutputDto | TargetingConditionDto)[]): string {
  const result = values[0].providerId.replace(',', '-');
  return `<li class="ml-25">${result.slice(1, -1)}</li>`;
}

function getGender(values: (SearchOutputDto | TargetingConditionDto)[]): string {
  const gender = (selectedGender: (SearchOutputDto | TargetingConditionDto)[]) => {
    switch (selectedGender[0].providerId[0]) {
      case '0':
        return 'All';
      case '1':
        return 'Men';
      case '2':
        return 'Women';
    }
  };
  return `<li class="ml-25">${gender(values)}</li>`;
}

function getLocationType(values: (SearchOutputDto | TargetingConditionDto)[]): string {
  return values.reduce((acc: any, current: any) => (acc += `<li class="ml-25">${current.providerId}</li>`), ``);
}

function getCities(values: (SearchOutputDto | TargetingConditionDto)[]): string {
  return values.reduce(
    (acc: any, current: any) =>
      (acc += `<li class="ml-25">${current.name},${current.region},${current.countryName || current.country}</li>`),
    ``,
  );
}

function getRegions(values: (SearchOutputDto | TargetingConditionDto)[]): string {
  return values.reduce(
    (acc: any, current: any) =>
      (acc += `<li class="ml-25">${current.name},${current.countryName || current.country}</li>`),
    ``,
  );
}

function getZips(values: (SearchOutputDto | TargetingConditionDto)[]): string {
  return values.reduce(
    (acc: any, current: any) =>
      (acc += `<li class="ml-25">${current.name},${current.countryName || current.country}</li>`),
    ``,
  );
}

function getCustomAudiences(values: (SearchOutputDto | TargetingConditionDto)[]): string {
  let html = '';
  if ((values as any).include?.length > 0) {
    const includes = (values as any).include.reduce((acc, item) => (acc += `<li class="ml-25">${item.name}</li>`), '');
    html += `<span>Include: </span> ${includes}`;
  }
  if ((values as any).exclude?.length > 0) {
    const excludes = (values as any).exclude.reduce((acc, item) => (acc += `<li class="ml-25">${item.name}</li>`), '');
    html += `<span>Exclude: </span> ${excludes}`;
  }
  return html;
}

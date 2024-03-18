import {
  AudienceLookalikeDto,
  AudienceLookalikeLocationsDto,
  AudienceLookalikeLocationSpecDto,
} from '@instigo-app/data-transfer-object';
import { startCase } from 'lodash-es';

export function convertAudienceLookalikeSpecToHtml(lookalikeSpec: AudienceLookalikeDto): string {
  let innerHTML = '';
  innerHTML += `<div>Source: ${lookalikeSpec.originAudience.name}</div>`;
  if (lookalikeSpec.hasOwnProperty('locationSpec')) {
    innerHTML += convertLocationSpec(lookalikeSpec.locationSpec);
  }
  return innerHTML;
}

function convertLocationSpec(locationSpec: AudienceLookalikeLocationSpecDto) {
  let innerHTML = '';
  if (locationSpec.hasOwnProperty('include')) {
    innerHTML += `<div>Include:</div>`;
    innerHTML += convertLocationSpecLocation(locationSpec.include);
  }
  if (locationSpec.hasOwnProperty('exclude')) {
    innerHTML += `<div>Exclude:</div>`;
    innerHTML += convertLocationSpecLocation(locationSpec.exclude);
  }
  return innerHTML;
}

function convertLocationSpecLocation(scope: AudienceLookalikeLocationsDto) {
  return Object.entries(scope).reduce((innerHTML, current: any) => {
    const [key, value] = current;
    innerHTML += `<strong>${startCase(key)}: </strong>(${value.length}) <ul>`;
    innerHTML += value.reduce((acc, cur) => (acc += `<li>${cur}</li>`), ``);
    innerHTML += `</ul>`;
    return innerHTML;
  }, ``);
}

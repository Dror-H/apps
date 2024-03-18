import { Pipe, PipeTransform } from '@angular/core';
import { AdAccountDTO } from '@instigo-app/data-transfer-object';

@Pipe({
  name: 'timeZoneDisplay',
})
export class TimeZoneDisplayPipe implements PipeTransform {
  transform(adAccount: AdAccountDTO): any {
    return `UTC(${adAccount?.timezoneOffsetHoursUtc || '00:00'})`;
  }
}

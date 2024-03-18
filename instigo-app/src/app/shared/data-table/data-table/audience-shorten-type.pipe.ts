import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'audienceShortenType',
})
export class AudienceShortenTypePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (args[0] === 'type') {
      value = value.replace(' Audience', '');
    }

    return value;
  }
}

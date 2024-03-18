import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exportTo',
})
export class ExportToPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value) {
      return `Export to ${value}`;
    }
    return 'Export';
  }
}

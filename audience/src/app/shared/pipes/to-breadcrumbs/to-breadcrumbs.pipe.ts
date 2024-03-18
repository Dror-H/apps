import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toBreadcrumbs',
})
export class ToBreadcrumbsPipe implements PipeTransform {
  transform(value: string[]): string {
    if (Array.isArray(value)) {
      const titleCase = new TitleCasePipe().transform;

      return value.map((v, i) => (i < value.length - 1 ? titleCase(v) + ' >' : titleCase(v))).join(' ');
    }
    return value;
  }
}

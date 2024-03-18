import { Pipe, PipeTransform } from '@angular/core';

// TODO: change this, it's totally not ok!
@Pipe({
  name: 'escapeRegExp',
})
export class EscapeRegExp implements PipeTransform {
  transform(value: string): string {
    return this.escapeRegExp(value);
  }

  escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
}

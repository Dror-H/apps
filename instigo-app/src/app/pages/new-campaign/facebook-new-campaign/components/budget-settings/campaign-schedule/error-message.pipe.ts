import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'errorMessage' })
export class ErrorMessagePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value?.range) {
      return 'Start date should be before the end date';
    }
    if (value?.rangeMin) {
      return 'The Ad Set must be scheduled to run at least 24h';
    }

    return 'There are some errors';
  }
}

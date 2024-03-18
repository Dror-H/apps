import { PipeTransform } from '@nestjs/common';
import { camelCase, startCase } from 'lodash-es';
import { Pipe } from '@angular/core';

@Pipe({ name: 'optimizedForPipe' })
export class OptimizedForPipe implements PipeTransform {
  transform(value: { optimizedFor: string }): string {
    return value.optimizedFor === 'LANDING_PAGE_VIEWS' ? 'LP Views' : startCase(camelCase(value.optimizedFor));
  }
}

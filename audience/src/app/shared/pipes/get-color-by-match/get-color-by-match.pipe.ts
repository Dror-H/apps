import { Pipe, PipeTransform } from '@angular/core';
import { NzPresetColor } from 'ng-zorro-antd/core/color';

@Pipe({ name: 'getColorByMatch', pure: true })
export class GetColorByMatchPipe implements PipeTransform {
  transform(value: number): NzPresetColor | null {
    return getColorFromPercentage(value);
  }
}

function getColorFromPercentage(percentage: number): NzPresetColor | null {
  if (percentage >= 85) {
    return 'green';
  }
  if (percentage >= 70 && percentage < 85) {
    return 'lime';
  }
  if (percentage >= 60 && percentage < 70) {
    return 'gold';
  }
  if (percentage > 0 && percentage < 60) {
    return 'orange';
  }
  return null;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NzMarks } from 'ng-zorro-antd/slider';

export interface Ratio {
  name: string;
  value: number;
  marks: NzMarks;
}

@Component({
  selector: 'audi-custom-ratio',
  templateUrl: './custom-ratio.component.html',
  styleUrls: ['./custom-ratio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomRatioComponent {
  @Input() public ratiosEnabled = false;
  @Input() public ratios: Ratio[];

  public value = 0;

  public handleRatioChange(sliderValue: number, ratioIndex: number): void {
    // TBD
  }
}

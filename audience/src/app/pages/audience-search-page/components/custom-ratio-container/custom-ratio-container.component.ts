import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RatioSliderData } from '@audience-app/pages/audience-search-page/components/custom-ratio-container/custom-ratio-container.models';

@Component({
  selector: 'audi-custom-ratio-container',
  templateUrl: './custom-ratio-container.component.html',
  styleUrls: ['./custom-ratio-container.component.scss'],
  animations: [
    trigger('openClose', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0px' })),
      transition('false <=> true', animate('400ms 0ms ease-in')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomRatioContainerComponent {
  public ratiosEnabled = false;
  public ratios: RatioSliderData[] = [
    { name: 'Interests', value: 10, marks: { 0: 'Interests', 100: '10' } },
    { name: 'Demographics', value: 30, marks: { 0: 'Demographics', 100: '30' } },
    { name: 'Behaviors', value: 60, marks: { 0: 'Behaviors', 100: '60' } },
  ];
}

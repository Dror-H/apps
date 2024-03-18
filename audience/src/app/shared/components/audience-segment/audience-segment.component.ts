import { Component, Input } from '@angular/core';
import { TargetingConditionDto, TargetingType } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'audi-segment',
  templateUrl: './audience-segment.component.html',
  styleUrls: ['./audience-segment.component.scss'],
})
export class AudienceSegmentComponent {
  @Input() segment: TargetingConditionDto<TargetingType>;
}

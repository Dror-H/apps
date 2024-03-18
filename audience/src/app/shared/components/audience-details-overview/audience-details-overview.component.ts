import { Component, Input } from '@angular/core';
import { TargetingTypesPercentages, TARGETING_TYPES } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'audi-details-overview',
  templateUrl: './audience-details-overview.component.html',
  styleUrls: ['./audience-details-overview.component.scss'],
})
export class AudienceDetailsOverviewComponent {
  @Input() rank: number;
  @Input() specRatio: TargetingTypesPercentages;

  public targetingTypes = TARGETING_TYPES;
}

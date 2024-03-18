import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { audienceSourceOptions } from '@instigo-app/data-transfer-object';
import { overviewSections } from '../../facebook-new-campaign.data';

@Component({
  selector: 'ingo-campaign-overview',
  templateUrl: './campaign-overview.component.html',
  styleUrls: ['./campaign-overview.component.scss'],
})
export class CampaignOverviewComponent {
  @Input() campaignForm: FormGroup;
  @Output() collapseStep = new EventEmitter<number>();

  public overviewSections = overviewSections;
  public creativesOverviewSections = overviewSections[0].subSections.slice(0, 4);
  public creativesOptionalOverviewSections = overviewSections[0].subSections.slice(4);
  public step: number;
  public audienceSourceOptions = audienceSourceOptions;

  @Input() set stepFunc(value: number) {
    this.step = value;
  }

  public setStep(step: number): void {
    this.step = step;
    this.collapseStep.emit(step);
  }
}

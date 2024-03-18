import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdTemplateType } from '@instigo-app/data-transfer-object';
import { overviewSections } from '../../linkedin-new-campaign.data';

@Component({
  selector: 'ingo-linkedin-campaign-overview',
  templateUrl: './linkedin-campaign-overview.component.html',
})
export class LinkedinCampaignOverviewComponent {
  @Input() campaignForm: FormGroup;
  @Output() collapseStep = new EventEmitter<number>();
  public step: number;

  public overviewSections = overviewSections;
  public creativesOverviewSections = overviewSections[0].subSections;
  public adTemplateType = AdTemplateType;

  @Input() set stepFunc(value: number) {
    this.step = value;
  }

  public setStep(step: number): void {
    this.step = step;
    this.collapseStep.emit(step);
  }
}

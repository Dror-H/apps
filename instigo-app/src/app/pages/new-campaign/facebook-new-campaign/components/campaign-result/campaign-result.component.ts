import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzResultStatusType } from 'ng-zorro-antd/result';
import { FacebookCampaignDraft } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-campaign-result',
  templateUrl: './campaign-result.component.html',
})
export class CampaignResultComponent {
  @Input() result: CampaignResult;
  @Output() startOver = new EventEmitter();
  @Output() retry = new EventEmitter();
}

export interface CampaignResult {
  title: string;
  description?: string;
  descriptionId?: string;
  type: NzResultStatusType;
  campaign?: FacebookCampaignDraft;
  error?: any;
}

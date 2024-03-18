import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdTemplateType } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-linkedin-multivariate-ads',
  templateUrl: './linkedin-multivariate-ads.component.html',
})
export class LinkedinMultivariateAdsComponent {
  @Input() multivariate = new FormGroup({});
  @Output() nextStepEmitter = new EventEmitter<void>();

  public adType = AdTemplateType;
}

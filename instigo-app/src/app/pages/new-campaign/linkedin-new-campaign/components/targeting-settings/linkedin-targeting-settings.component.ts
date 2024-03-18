import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdAccountDTO, SupportedProviders, TargetingDto } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-linkedin-targeting-settings',
  templateUrl: './linkedin-targeting-settings.component.html',
})
export class LinkedinTargetingSettingsComponent implements OnInit {
  @Input() adAccount: AdAccountDTO;
  @Input() targetingForm = new FormGroup({});
  @Output() setStep = new EventEmitter<number>();

  public supportedProviders = SupportedProviders;
  public rulesValue: TargetingDto = null;

  ngOnInit(): void {
    this.targetingForm.get('targetingCriteria.adAccount').setValue(this.adAccount);
  }
}

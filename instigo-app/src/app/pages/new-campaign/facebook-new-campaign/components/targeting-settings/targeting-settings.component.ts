import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AudienceDto, audienceSourceOptions } from '@instigo-app/data-transfer-object';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ingo-nc-targeting-settings',
  templateUrl: './targeting-settings.component.html',
  styleUrls: ['./targeting-settings.component.scss'],
})
export class NCTargetingSettingsComponent {
  @Input() targetingForm: FormGroup;
  @Output() setStep = new EventEmitter<void>();

  public audienceSourceOptions = audienceSourceOptions;
  public targetingProperties: FormGroup;
  public customAudiences: AudienceDto[] = [];

  public submitForm(): void {
    for (const i in this.targetingProperties.controls) {
      this.targetingProperties.controls[i].markAsDirty();
      this.targetingProperties.controls[i].updateValueAndValidity();
    }
  }

  public resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.targetingProperties.reset();
    for (const key in this.targetingProperties.controls) {
      this.targetingProperties.controls[key].markAsPristine();
      this.targetingProperties.controls[key].updateValueAndValidity();
    }
  }
}

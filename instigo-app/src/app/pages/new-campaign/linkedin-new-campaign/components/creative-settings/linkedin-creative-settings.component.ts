import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'ingo-linkedin-creative-settings',
  templateUrl: './linkedin-creative-settings.component.html',
})
export class LinkedinCreativeSettingsComponent {
  @Input() creativesForm = new FormGroup({});
  @Output() setStep = new EventEmitter<number>();

  public onNextStepEmitter(): void {
    this.setStep.emit(2);
  }
}

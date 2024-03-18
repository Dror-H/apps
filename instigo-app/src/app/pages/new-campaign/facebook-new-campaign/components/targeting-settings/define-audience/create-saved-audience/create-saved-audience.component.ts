import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TargetingDto } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'app-create-saved-audience',
  templateUrl: './create-saved-audience.component.html',
})
export class CreateSavedAudienceComponent implements OnInit {
  @Input() createAudienceForm: FormGroup;
  public existingRules: TargetingDto = null;
  public adAccount: FormControl;

  ngOnInit(): void {
    this.adAccount = this.createAudienceForm.parent.parent.get('settings.account') as FormControl;
    if (this.createAudienceForm.value.target) {
      this.existingRules = this.createAudienceForm.value.target;
    }
  }
}

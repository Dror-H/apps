import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TargetingDto } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'app-saved-audience-targeting',
  templateUrl: './saved-audience-targeting.component.html',
})
export class SavedAudienceTargetingComponent {
  @Input() audienceForm: FormGroup = new FormGroup({});
  @Input() adAccount: FormControl;
  @Input() rules: TargetingDto = null;
}

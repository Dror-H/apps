import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AudienceDto, TargetingTemplateDto } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'app-load-saved-audience',
  templateUrl: './load-saved-audience.component.html',
})
export class LoadSavedAudienceComponent implements OnInit {
  @Input()
  loadAudienceForm: FormGroup;

  public customAudiences: AudienceDto[] = [];
  public adAccount: FormControl;
  public showTargetingDetails = false;
  public rules;

  public audienceTypes = [
    { name: 'Saved Audience', value: false },
    { name: 'Targeting', value: true },
  ];

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.addTargetingSettingsForm();
    this.initialize();
    this.rules = { ...this.loadAudienceForm.value.target };
  }

  public selectAudience(targeting: TargetingTemplateDto) {
    targeting = { ...targeting, audienceType: targeting.type, target: targeting.rules };
    this.showTargetingDetails = false;
    this.loadAudienceForm.patchValue(targeting);
    // now notify angular to check for updates
    // change detection should remove the component now
    // then we can enable it again to create a new instance
    this.changeDetector.detectChanges();
    this.rules = { ...this.loadAudienceForm.value.target };
    this.showTargetingDetails = true;
  }

  initialize(): void {
    if (this.loadAudienceForm.value.id != null) {
      this.showTargetingDetails = true;
    }
  }

  private addTargetingSettingsForm(): void {
    this.adAccount = this.loadAudienceForm.parent.parent.get('settings.account') as FormControl;
  }
}

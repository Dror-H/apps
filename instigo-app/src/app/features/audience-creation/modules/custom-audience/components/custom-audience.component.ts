import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { customerFilesSelectedValidator } from '@app/shared/shared/custom-form.validators';
import { AudienceList, AudienceRulesDto, AudienceSubType, SupportedProviders } from '@instigo-app/data-transfer-object';
import { delay } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-custom-audience',
  templateUrl: './custom-audience.component.html',
  styleUrls: ['./custom-audience.component.scss'],
})
export class CustomAudienceComponent implements OnInit, OnDestroy {
  @Input() adTemplateForm: FormGroup;
  @Output() isFormValid = new EventEmitter<boolean>();

  public AudienceSubType = AudienceSubType;
  public audienceRules = {
    [SupportedProviders.FACEBOOK]: new FormControl({}),
    [SupportedProviders.LINKEDIN]: new FormControl({}),
  };
  public audienceFiles = {
    [SupportedProviders.FACEBOOK]: new FormControl(null as AudienceList, [
      Validators.required,
      customerFilesSelectedValidator,
    ]),
    // TODO - when LINKEDIN is implemented, add fieldsSelectionValidator after required validator
    [SupportedProviders.LINKEDIN]: new FormControl({} as AudienceList, [Validators.required]),
  };
  public customAudienceList: { [key in SupportedProviders]: AudienceList } = {} as any;

  private subscriptions = new SubSink();

  ngOnInit() {
    this.isFormValid.emit(false);

    this.subscriptions.sink = this.audienceRules.facebook.valueChanges.subscribe((rules) => {
      this.isFormValid.emit(rules.valid);
      this.updateAudience({ provider: SupportedProviders.FACEBOOK, rules: rules.rule });
    });

    this.subscriptions.sink = this.audienceFiles.facebook.valueChanges.subscribe((value: AudienceList) => {
      this.isFormValid.emit(this.audienceFiles[SupportedProviders.FACEBOOK].valid);
      this.updateAudienceList({ provider: SupportedProviders.FACEBOOK, value });
    });

    this.subscriptions.sink = this.audienceRules.linkedin.valueChanges.pipe(delay(500)).subscribe((rules) => {
      this.isFormValid.emit(rules.valid);
      this.updateAudience({ provider: SupportedProviders.LINKEDIN, rules: rules.rule });
    });

    this.subscriptions.sink = this.audienceFiles.linkedin.valueChanges
      .pipe(delay(1000))
      .subscribe((value: AudienceList) => {
        this.isFormValid.emit(this.audienceFiles[SupportedProviders.LINKEDIN].valid);
        this.updateAudienceList({ provider: SupportedProviders.LINKEDIN, value });
      });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private updateAudience(options: { provider: SupportedProviders; rules?: AudienceRulesDto | AudienceList }): void {
    const { provider, rules } = options;
    this.adTemplateForm.controls.provider.setValue(provider);
    this.adTemplateForm.controls.target.setValue(rules);
  }

  private updateAudienceList(options: { provider: SupportedProviders; value: AudienceList }): void {
    const { provider, value } = options;
    value.fieldsSelection = value.fields;
    this.customAudienceList[provider] = value;
    this.updateAudience({ provider, rules: value });
  }
}

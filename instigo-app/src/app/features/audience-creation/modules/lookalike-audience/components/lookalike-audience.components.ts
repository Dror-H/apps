import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AudienceLookalikeDto, AudienceSubType, SupportedProviders } from '@instigo-app/data-transfer-object';
import { set } from 'lodash-es';
import { SubSink } from 'subsink';
import { lookalikeAudienceValidator } from '@app/shared/shared/custom-form.validators';

@Component({
  selector: 'ingo-lookalike-audience',
  templateUrl: './lookalike-audience.component.html',
})
export class LookalikeAudienceComponent implements OnInit, OnDestroy {
  @Input() audienceForm: FormGroup;
  @Output() isFormValid = new EventEmitter<boolean>();
  public AudienceSubType = AudienceSubType;

  public audienceLookalikes = {
    [SupportedProviders.FACEBOOK]: new FormControl(
      {
        list: [],
        reaches: [],
      },
      [Validators.required, lookalikeAudienceValidator],
    ),
    [SupportedProviders.LINKEDIN]: new FormControl({ list: [], reaches: [] }, Validators.required),
  };

  private lookalikeSpecsList: {
    [key in SupportedProviders]: { list: AudienceLookalikeDto[]; reaches: number[] };
  } = {} as any;

  private subscriptions = new SubSink();

  ngOnInit(): void {
    this.isFormValid.emit(false);

    this.subscriptions.sink = this.audienceLookalikes.facebook.valueChanges.subscribe(
      (value: { list: AudienceLookalikeDto[]; reaches: number[] }) => {
        this.isFormValid.emit(this.audienceLookalikes.facebook.valid);
        this.updateAudienceLookalikes({ provider: SupportedProviders.FACEBOOK, ...value });
      },
    );

    this.subscriptions.sink = this.audienceLookalikes.linkedin.valueChanges.subscribe(
      (value: { list: AudienceLookalikeDto[]; reaches: number[] }) => {
        this.isFormValid.emit(this.audienceLookalikes.linkedin.valid);
        this.updateAudienceLookalikes({ provider: SupportedProviders.LINKEDIN, ...value });
      },
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private updateAudienceLookalikes(options: {
    provider: SupportedProviders;
    list: AudienceLookalikeDto[];
    reaches: number[];
  }): void {
    const { provider, list, reaches } = options;
    set(this.lookalikeSpecsList, [provider, 'list'], list);
    set(this.lookalikeSpecsList, [provider, 'reaches'], reaches);
    this.audienceForm.controls.target.setValue({ lookalikeSpecsList: this.lookalikeSpecsList });
  }
}

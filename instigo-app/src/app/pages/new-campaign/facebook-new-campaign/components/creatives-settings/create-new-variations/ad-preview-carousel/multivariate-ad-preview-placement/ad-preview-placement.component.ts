import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { allPlacements, placementTypes } from '@app/global/ad-placements';
import { AdCreativePreview } from '@app/models/new-campaign.model';
import { ControlValueAccessorBaseHelper } from '@app/shared/shared/control-value-accessor-base-helper';
import { SupportedProviders } from '@instigo-app/data-transfer-object';
import { flatten } from 'lodash-es';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-ad-preview-placement',
  templateUrl: './ad-preview-placement.component.html',
  styleUrls: ['./ad-preview-placement.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdPreviewPlacementComponent),
      multi: true,
    },
  ],
})
export class AdPreviewPlacementComponent extends ControlValueAccessorBaseHelper implements OnInit, OnDestroy {
  @Input() instagramAccountControl = new FormControl(null);
  @Input() adSetFormat = [];
  @Output() placementPreview = new EventEmitter<AdCreativePreview>();
  public adTemplateOptions = {} as AdCreativePreview;
  public adTemplateOptionsKeys: { label: string; value: boolean }[] = [];
  public activePreviewValue: string;
  public adPlacementForm: FormGroup;
  public providerValue = SupportedProviders.FACEBOOK;

  private subSink = new SubSink();

  constructor(private fb: FormBuilder) {
    super();
  }

  private get devices(): FormGroup {
    return this.adPlacementForm.controls.devices as FormGroup;
  }

  private get placements(): FormGroup {
    return this.adPlacementForm.controls.placements as FormGroup;
  }

  ngOnInit(): void {
    this.adPlacementForm = this.fb.group({
      devices: this.fb.group({
        desktop: this.fb.control(true),
        mobile: this.fb.control(true),
      }),
      placements: this.fb.group({
        facebook: this.fb.control(true),
        instagram: this.fb.control(true),
        audience: this.fb.control(true),
        messenger: this.fb.control(true),
      }),
    });

    this.setAdPlacementOptions();
    setTimeout(() => {
      this.setForm();
    });

    this.listenOnDevicesChangeAndUpdateToggleAdFormat();
    this.listenOnPlatformsChangeAndUpdateToggleAdFormat();
    this.listenOnInstagramControl();
    this.setInstagramPlacementsDependsOnTheFirstValue();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public toggleAdFormat(
    $event,
    adFormat: { label: string; value: any; platform: string; checked: boolean; disabled: boolean },
  ): void {
    $event.stopPropagation();
    adFormat.checked = !adFormat.checked;
    this.setForm();
  }

  public toggleAllInSubCategory($event, categoryKey: { label: string; value: boolean }): void {
    categoryKey.value = !categoryKey.value;
    this.adTemplateOptions[categoryKey.label].forEach((item) => (item.checked = categoryKey.value));
    this.setForm();
  }

  public activePreview(formatValue: any): void {
    this.activePreviewValue = formatValue;
    this.placementPreview.emit(formatValue);
  }

  private setAdPlacementOptions(): void {
    for (const placementType of placementTypes[this.providerValue]) {
      const aux = [];
      for (const key in allPlacements[this.providerValue]) {
        aux.push(
          allPlacements[this.providerValue][key]
            .filter((item) => item.type === placementType)
            .map((item) => {
              let checked;
              if (this.adSetFormat.length > 0) {
                checked = !!this.adSetFormat.some((format) => format.platform === key && format.value === item.value);
              } else {
                checked = true;
              }
              return {
                label: item.label,
                value: item,
                platform: key,
                checked: checked,
                disabled: false,
              };
            }),
        );
      }
      this.adTemplateOptions[placementType] = flatten(aux);
    }
    this.adTemplateOptionsKeys = placementTypes[this.providerValue].map((item) => ({ label: item, value: true }));
    this.activePreview(this.adTemplateOptions[placementTypes[this.providerValue][0]][0].value);
  }

  private setForm(): void {
    this.updateValue(
      flatten(Object.values(this.adTemplateOptions))
        .filter((item) => item.checked)
        .map((item) => ({
          platform: item.platform,
          value: item.value.value,
        })),
    );
  }

  private updateValue(value): void {
    this.writeValue(value);
    this.onChanged(value);
  }

  private listenOnDevicesChangeAndUpdateToggleAdFormat(): void {
    this.subSink.sink = this.devices.valueChanges.subscribe((change) => {
      this.disableAllAdFormatsOnSpecificDevice(change);
      this.setForm();
    });
  }

  private listenOnPlatformsChangeAndUpdateToggleAdFormat(): void {
    for (const platform in allPlacements[this.providerValue]) {
      this.subSink.sink = this.placements.get(platform.split('_')[0]).valueChanges.subscribe((change) => {
        this.platformChangeReflectValue(platform, change);
        this.setForm();
      });
    }
  }

  private listenOnInstagramControl(): void {
    this.subSink.sink = this.instagramAccountControl.valueChanges.subscribe(() => {
      if (!this.instagramAccountControl.value) {
        this.placements.get('instagram').setValue(false);
      }
    });
    this.subSink.sink = this.instagramAccountControl.valueChanges.subscribe(() => {
      if (this.instagramAccountControl.value) {
        this.placements.get('instagram').setValue(true);
      }
    });
  }

  private setInstagramPlacementsDependsOnTheFirstValue(): void {
    this.placements.get('instagram').setValue(!!this.instagramAccountControl.value);
  }

  private disableAllAdFormatsOnSpecificDevice(change: { desktop: boolean; mobile: boolean }): void {
    this.placements.get('instagram').setValue(change.mobile);
    this.placements.get('messenger').setValue(change.mobile);
    this.placements.get('audience').setValue(change.mobile);
    flatten(Object.values(this.adTemplateOptions)).forEach((option) => {
      if (!option.value.availableOn.mobile) {
        option.disabled = !change.desktop;
        option.checked = change.desktop;
      }
      if (!option.value.availableOn.desktop) {
        option.disabled = !change.mobile;
        option.checked = change.mobile;
      }
    });
  }

  private platformChangeReflectValue(platform: string, change: boolean): void {
    flatten(Object.values(this.adTemplateOptions))
      .filter((item) => item.platform === platform)
      .forEach((item) => {
        item.checked = change;
        item.disabled = !change;
      });
  }
}

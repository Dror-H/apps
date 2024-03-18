import { debounceTime, mergeMap, startWith, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { isArray } from 'lodash-es';
import { SubSink } from 'subsink';
import { PreviewBase } from '@app/pages/new-campaign/facebook-new-campaign/components/creatives-settings/create-new-variations/ad-preview-carousel/preview-base';
import { AdAccountDTO } from '@instigo-app/data-transfer-object';
import { AdCreativePreview } from '@app/models/new-campaign.model';
import { multivariateFields } from '@app/shared/ad-template/ad-template-control.manager';

export class MultivariateGenerator extends PreviewBase {
  private static DEBOUNCE_TIME = 500;
  public adAccount: AdAccountDTO;

  constructor(private multivariate: FormGroup, private subSink: SubSink) {
    super();
    this.adAccount = this.multivariate.parent.parent.get('settings.account').value;
  }

  public get campaignObjective(): string {
    return this.multivariate.parent.parent.get('settings.objective').value;
  }

  public get adCombinations(): FormControl {
    return this.multivariate.get('adCombinations') as FormControl;
  }

  public placementPreview(previewType: AdCreativePreview): void {
    this.setAdCombinations([]);
    this.generatePreviewType(previewType);
    this.formCombinations.forEach((item) => (item['adFormat'] = this.previewType[this.isMobile]));
    setTimeout(() => {
      this.setAdCombinations(this.formCombinations);
    }, 200);
  }

  public previewDevice($event): void {
    this.setAdCombinations([]);
    this.getPreviewDevice($event);
    this.formCombinations.forEach((item) => (item['adFormat'] = this.previewType[this.isMobile]));
    setTimeout(() => {
      this.setAdCombinations(this.formCombinations);
    }, 200);
  }

  public generateMultiVariateAds(): void {
    this.subSink.sink = this.multivariate
      .get('adTemplateType')
      .valueChanges.pipe(
        startWith(this.multivariate.get('adTemplateType').value),
        mergeMap((adTemplateType) =>
          this.multivariate.get(adTemplateType.toLowerCase()).valueChanges.pipe(
            startWith(this.multivariate.get(adTemplateType.toLowerCase()).value),
            debounceTime(MultivariateGenerator.DEBOUNCE_TIME),
            tap((change) => {
              if (this.multivariate.valid) {
                const arrayOptions = this.getArrayTypeFields(change);
                if (Object.keys(arrayOptions)?.length > 0) {
                  this.formCombinations = this.getAllAdTemplateCombinations(arrayOptions, 0, [], {});
                } else {
                  this.formCombinations = [{}];
                }
                this.addSettingsControls();
                this.addMissingControlsToFormCombinations(change);
                this.addCampaignObjective();
                this.setAdCombinations(this.formCombinations);
              }
            }),
          ),
        ),
      )
      .subscribe();
  }

  private getAllAdTemplateCombinations(options, optionIndex, results, current): any {
    const allKeys = Object.keys(options);
    const optionKey = allKeys[optionIndex];
    const array = options[optionKey];
    for (let i = 0; i < array.length; i++) {
      current[optionKey] = array[i];
      if (optionIndex + 1 < allKeys.length) {
        this.getAllAdTemplateCombinations(options, optionIndex + 1, results, current);
      } else {
        const adTemplateCombinations = {};
        Object.keys(current).forEach((key) => (adTemplateCombinations[key] = current[key]));
        results.push(adTemplateCombinations);
      }
    }
    return results;
  }

  private addMissingControlsToFormCombinations(change): void {
    const nonArrayFields = {};
    Object.keys(change)
      .filter((item) => !isArray(change[item]) || item === 'childAttachments')
      .forEach((key) => (nonArrayFields[key] = change[key]));

    this.formCombinations.forEach((adTemplateItem) =>
      Object.keys(nonArrayFields).forEach((field) => {
        if (field === 'adFormat') {
          adTemplateItem[field] = this.previewType[this.isMobile];
        } else {
          adTemplateItem[field] = nonArrayFields[field];
        }
      }),
    );
  }

  private addCampaignObjective(): void {
    this.formCombinations.forEach((adTemplateItem) => {
      adTemplateItem.campaignObjective = this.campaignObjective;
    });
  }

  private getArrayTypeFields(change): any {
    const arrayOptions = {};
    Object.keys(change)
      .filter((item) => isArray(change[item]) && multivariateFields[item] != null)
      .forEach((key) => (arrayOptions[key] = change[key]));
    return arrayOptions;
  }

  private addSettingsControls(): void {
    this.formCombinations.forEach((item) => {
      item['adFormat'] = this.previewType[this.isMobile];
      item['adAccount'] = this.adAccount;
      item['adTemplateType'] = this.multivariate.get('adTemplateType').value;
    });
  }

  private setAdCombinations(formCombinations): void {
    this.adCombinations.setValue(formCombinations);
  }
}

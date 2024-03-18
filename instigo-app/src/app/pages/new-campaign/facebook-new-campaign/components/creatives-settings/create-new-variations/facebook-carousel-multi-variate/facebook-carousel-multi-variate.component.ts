import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { AdTemplateService } from '@app/features/ad-template-operation/services/ad-template.service';
import { CAROUSEL_MAX_CHILDREN } from '@app/global/utils';
import { MultiVariateCreativesService } from '@app/pages/new-campaign/services/multi-variate-creatives.service';
import { FacebookAdTemplateGeneratorService } from '@app/pages/new-campaign/facebook-new-campaign/services/facebook-ad-template-generator.service';
import { SupportedProviders } from '@instigo-app/data-transfer-object';

@Component({
  selector: 'ingo-facebook-carousel-multi-variate',
  templateUrl: 'facebook-carousel-multi-variate.component.html',
})
export class FacebookCarouselMultiVariateComponent implements OnInit {
  @Input() multivariateCarouselForm: FormGroup = new FormGroup({});
  @Input() campaignObjective: string = null;

  public adAccountId: string;
  public provider = SupportedProviders.FACEBOOK;
  public MAX_CHILDREN = CAROUSEL_MAX_CHILDREN;

  constructor(
    private multiVariateService: MultiVariateCreativesService,
    private adTemplateService: AdTemplateService,
    private adTemplateGenerator: FacebookAdTemplateGeneratorService,
  ) {}

  public get adAccountForm(): FormControl {
    return this.multivariateCarouselForm.parent.parent.parent.get('settings.account') as FormControl;
  }

  public childAttachments(): FormArray {
    return this.multivariateCarouselForm.get('childAttachments') as FormArray;
  }

  public addChild(): void {
    this.adTemplateGenerator.addCarouselChild(this.multivariateCarouselForm);
  }

  public removeChild(index: number): void {
    this.adTemplateGenerator.removeChild(this.multivariateCarouselForm, index);
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.childAttachments().controls, event.previousIndex, event.currentIndex);
  }

  public addControl(name: string): void {
    this.multiVariateService.addControl(name, this.multivariateCarouselForm);
  }

  public removeControl(formArray: AbstractControl, index: number): void {
    if (index > 0) {
      (formArray as FormArray).removeAt(index);
    }
  }

  ngOnInit(): void {
    this.adAccountId = this.adAccountForm.value.id;
  }
}

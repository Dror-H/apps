import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdCreativePreview } from '@app/models/new-campaign.model';
import { SubSink } from 'subsink';
import { MultivariateGenerator } from '@app/shared/ad-template/multivariate-generator';

@Component({
  selector: 'ingo-ad-preview-carousel-container',
  templateUrl: './ad-preview-carousel-container.component.html',
  styleUrls: ['./ad-preview-carousel-container.component.scss'],
})
export class AdPreviewCarouselContainerComponent implements OnInit, OnDestroy {
  @Input() multivariate = new FormGroup({});
  public adSetFormat: FormControl;
  public instagramAccountControl: FormControl;
  public multivariateGenerator: MultivariateGenerator;
  private subSink = new SubSink();

  ngOnInit(): void {
    this.multivariateGenerator = new MultivariateGenerator(this.multivariate, this.subSink);
    this.adSetFormat = this.multivariate.parent.parent.get('adSetFormat') as FormControl;
    this.listenOnCampaignChangesAndGeneratePreviewList();
    this.instagramAccountControl = this.getInstagramAccountControl();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  public placementPreview(previewType: AdCreativePreview): void {
    this.multivariateGenerator.placementPreview(previewType);
  }

  public previewDevice($event): void {
    this.multivariateGenerator.previewDevice($event);
  }

  private listenOnCampaignChangesAndGeneratePreviewList(): void {
    this.multivariateGenerator.generateMultiVariateAds();
  }

  private getInstagramAccountControl(): FormControl {
    const adTemplateType = this.multivariate.value.adTemplateType;
    return this.multivariate.get(adTemplateType.toLowerCase())?.get('social')?.get('instagramAccount') as FormControl;
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdCreativePreview } from '@app/models/new-campaign.model';
import { MultivariateGenerator } from '@app/shared/ad-template/multivariate-generator';
import { SubSink } from 'subsink';

@Component({
  selector: 'ingo-linkedin-preview-carousel-container',
  templateUrl: './linkedin-ad-preview-carousel-container.component.html',
})
export class LinkedinAdPreviewCarouselContainerComponent implements OnInit, OnDestroy {
  @Input() multivariate = new FormGroup({});

  public multivariateGenerator: MultivariateGenerator;
  private subSink = new SubSink();

  ngOnInit(): void {
    this.multivariateGenerator = new MultivariateGenerator(this.multivariate, this.subSink);
    this.placementPreview({
      availableOn: {
        desktop: 'WEBCONVERSION_DESKTOP',
        mobile: 'WEBCONVERSION_MOBILE',
      },
      label: 'Linkedin Feed',
      type: 'Feed',
      value: 'feed',
    });
    this.listenOnCampaignChangesAndGeneratePreviewList();
  }

  ngOnDestroy() {
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
}

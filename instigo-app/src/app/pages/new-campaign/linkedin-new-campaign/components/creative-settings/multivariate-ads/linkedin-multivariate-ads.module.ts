import { NgModule } from '@angular/core';
import { LinkedinMultivariateAdsComponent } from './linkedin-multivariate-ads.component';
import { LinkedinImageMultivariateModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/creative-settings/multivariate-ads/linkedin-image-multivariate/linkedin-image-multivariate.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { LinkedinAdPreviewCarouselContainerModule } from '@app/pages/new-campaign/linkedin-new-campaign/components/creative-settings/multivariate-ads/ad-preiview-carousel/linkedin-ad-preview-carousel-container.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LinkedinMultivariateAdsComponent],
  imports: [
    CommonModule,
    LinkedinImageMultivariateModule,
    LinkedinAdPreviewCarouselContainerModule,
    NzGridModule,
    NzButtonModule,
    NzDividerModule,
  ],
  exports: [LinkedinMultivariateAdsComponent],
})
export class LinkedinMultivariateAdsModule {}

import { NgModule } from '@angular/core';
import { LinkedinAdPreviewCarouselContainerComponent } from './linkedin-ad-preview-carousel-container.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CommonModule } from '@angular/common';
import { AdPreviewCarouselModule } from '@app/pages/new-campaign/facebook-new-campaign/components/creatives-settings/create-new-variations/ad-preview-carousel/multivariate-ad-preview-carousel/ad-preview-carousel.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [LinkedinAdPreviewCarouselContainerComponent],
  imports: [CommonModule, AdPreviewCarouselModule, UiSharedModule, NzTabsModule, NzFormModule],
  exports: [LinkedinAdPreviewCarouselContainerComponent],
})
export class LinkedinAdPreviewCarouselContainerModule {}

import { NgModule } from '@angular/core';
import { AdPreviewCarouselComponent } from './ad-preview-carousel.component';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { AdPreviewCarouselItemModule } from '../multivariate-ad-preview-carousel-item/ad-preview-carousel-item.module';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [AdPreviewCarouselComponent],
  exports: [AdPreviewCarouselComponent],
  imports: [CommonModule, AdPreviewCarouselItemModule, UiSharedModule, NzCarouselModule, NzGridModule, NzButtonModule],
})
export class AdPreviewCarouselModule {}

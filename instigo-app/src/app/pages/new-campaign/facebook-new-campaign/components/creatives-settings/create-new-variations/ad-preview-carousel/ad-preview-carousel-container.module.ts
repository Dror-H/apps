import { NgModule } from '@angular/core';
import { AdPreviewCarouselContainerComponent } from './ad-preview-carousel-container.component';
import { CommonModule } from '@angular/common';
import { AdPreviewCarouselModule } from './multivariate-ad-preview-carousel/ad-preview-carousel.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AdPreviewPlacementModule } from './multivariate-ad-preview-placement/ad-preview-placement.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [AdPreviewCarouselContainerComponent],
  imports: [
    CommonModule,
    AdPreviewCarouselModule,
    UiSharedModule,
    AdPreviewPlacementModule,
    NzFormModule,
    NzToolTipModule,
    ReactiveFormsModule,
    NzRadioModule,
    NzCheckboxModule,
    NzTabsModule,
  ],
  exports: [AdPreviewCarouselContainerComponent],
})
export class AdPreviewCarouselContainerModule {}

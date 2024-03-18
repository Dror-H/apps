import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiFacebookModule } from '@instigo-app/ui/facebook';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AdPreviewPlacementModule } from '../../create-new-variations/ad-preview-carousel/multivariate-ad-preview-placement/ad-preview-placement.module';
import { ExistingTemplatePreviewComponent } from './existing-template-preview.component';
import { AdPreviewCarouselItemModule } from '@app/pages/new-campaign/facebook-new-campaign/components/creatives-settings/create-new-variations/ad-preview-carousel/multivariate-ad-preview-carousel-item/ad-preview-carousel-item.module';

@NgModule({
  declarations: [ExistingTemplatePreviewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdPreviewCarouselItemModule,
    AdPreviewPlacementModule,
    UiFacebookModule,
    UiSharedModule,
    NzButtonModule,
    NzModalModule,
    NzTabsModule,
    NzFormModule,
    NzToolTipModule,
  ],
  exports: [ExistingTemplatePreviewComponent],
})
export class ExistingTemplatePreviewModule {}

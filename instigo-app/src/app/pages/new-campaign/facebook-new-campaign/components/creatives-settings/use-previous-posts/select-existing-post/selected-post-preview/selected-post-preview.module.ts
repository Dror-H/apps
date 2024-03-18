import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AdPreviewPlacementModule } from '../../../create-new-variations/ad-preview-carousel/multivariate-ad-preview-placement/ad-preview-placement.module';
import { SelectedPostPreviewComponent } from './selected-post-preview.component';

@NgModule({
  declarations: [SelectedPostPreviewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdPreviewPlacementModule,
    UiSharedModule,
    NzButtonModule,
    NzModalModule,
    NzTabsModule,
    NzFormModule,
    NzToolTipModule,
  ],
  exports: [SelectedPostPreviewComponent],
})
export class SelectedPostPreviewModule {}

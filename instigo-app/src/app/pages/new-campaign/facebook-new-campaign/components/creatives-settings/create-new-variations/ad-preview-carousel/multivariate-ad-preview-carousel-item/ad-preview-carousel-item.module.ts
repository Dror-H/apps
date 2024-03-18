import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InstigoAdPreviewModule, UiSharedModule } from '@instigo-app/ui/shared';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { AdPreviewCarouselItemComponent } from './ad-preview-carousel-item.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [AdPreviewCarouselItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiSharedModule,
    InstigoAdPreviewModule,
    NzFormModule,
    NzRadioModule,
    NzButtonModule,
  ],
  exports: [AdPreviewCarouselItemComponent],
})
export class AdPreviewCarouselItemModule {}

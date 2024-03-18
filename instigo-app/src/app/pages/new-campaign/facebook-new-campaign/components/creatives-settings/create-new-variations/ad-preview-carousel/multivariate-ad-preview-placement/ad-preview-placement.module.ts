import { AdPreviewPlacementComponent } from './ad-preview-placement.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { TranslateModule } from '@ngx-translate/core';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [AdPreviewPlacementComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzSwitchModule,
    NzFormModule,
    NzToolTipModule,
  ],
  exports: [AdPreviewPlacementComponent],
})
export class AdPreviewPlacementModule {}

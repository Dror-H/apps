import { NgModule } from '@angular/core';
import { MediaVideoUppyComponent } from './media-video-uppy.component';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { UppyAngularDashboardModule } from '@uppy/angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { SelectExistingModule } from '../select-existing/select-existing.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [MediaVideoUppyComponent],
  imports: [
    CommonModule,
    SelectExistingModule,
    UppyAngularDashboardModule,
    NzButtonModule,
    NzAlertModule,
    NzGridModule,
    NzSpinModule,
    NzIconModule,
  ],
  exports: [MediaVideoUppyComponent],
})
export class MediaVideoUppyModule {}

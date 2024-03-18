import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceDetailsComponent } from './audience-details.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [AudienceDetailsComponent],
  imports: [CommonModule, NzGridModule, NzCardModule],
  exports: [AudienceDetailsComponent],
})
export class AudienceDetailsModule {}

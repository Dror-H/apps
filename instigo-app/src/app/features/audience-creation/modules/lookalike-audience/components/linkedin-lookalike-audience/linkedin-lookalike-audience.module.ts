import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LinkedinLookalikeAudienceComponent } from './linkedin-lookalike-audience.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [LinkedinLookalikeAudienceComponent],
  imports: [CommonModule, FormsModule, NzGridModule, NzSelectModule, NzToolTipModule],
  exports: [LinkedinLookalikeAudienceComponent],
  providers: [],
})
export class LinkedinLookalikeAudienceModule {}

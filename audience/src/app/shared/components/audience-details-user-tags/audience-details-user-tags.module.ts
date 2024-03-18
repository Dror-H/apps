import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceDetailsUserTagsComponent } from './audience-details-user-tags.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [AudienceDetailsUserTagsComponent],
  exports: [AudienceDetailsUserTagsComponent],
  imports: [CommonModule, NzDividerModule, NzTagModule],
})
export class AudienceDetailsUserTagsModule {}

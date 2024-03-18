import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { UiSharedModule } from '@instigo-app/ui/shared';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CampaignsTableComponent } from './campaigns.component';

@NgModule({
  declarations: [CampaignsTableComponent],
  imports: [CommonModule, RouterModule, DataTableModule, UiSharedModule, NzToolTipModule],
  exports: [CampaignsTableComponent],
})
export class CampaignsModule {}

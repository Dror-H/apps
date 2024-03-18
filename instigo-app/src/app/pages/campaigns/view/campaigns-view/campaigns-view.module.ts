import { NgModule } from '@angular/core';
import { CampaignsViewComponent } from '@app/pages/campaigns/view/campaigns-view/campaigns-view.component';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RouterModule } from '@angular/router';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [CampaignsViewComponent],
  exports: [CampaignsViewComponent],
  imports: [DataTableModule, CommonModule, NzToolTipModule, NzSpinModule, UiSharedModule, RouterModule],
})
export class CampaignsViewModule {}

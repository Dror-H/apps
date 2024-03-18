import { NgModule } from '@angular/core';
import { AdSetsViewComponent } from '@app/pages/campaigns/view/adsets-view/adsets-view.component';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [AdSetsViewComponent],
  exports: [AdSetsViewComponent],
  imports: [DataTableModule, CommonModule, UiSharedModule, NzToolTipModule, NzSpinModule],
})
export class AdsetsViewModule {}

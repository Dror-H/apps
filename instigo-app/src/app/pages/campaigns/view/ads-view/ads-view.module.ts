import { NgModule } from '@angular/core';
import { AdsViewComponent } from '@app/pages/campaigns/view/ads-view/ads-view.component';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { CommonModule } from '@angular/common';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [AdsViewComponent],
  imports: [DataTableModule, CommonModule, UiSharedModule, NzToolTipModule, NzSpinModule],
  exports: [AdsViewComponent],
})
export class AdsViewModule {}

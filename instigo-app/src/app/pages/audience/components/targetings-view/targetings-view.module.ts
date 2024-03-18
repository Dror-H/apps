import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetingsViewComponent } from './targetings-view.component';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [TargetingsViewComponent],
  imports: [CommonModule, DataTableModule, UiSharedModule, NzToolTipModule],
  exports: [TargetingsViewComponent],
})
export class TargetingsViewModule {}

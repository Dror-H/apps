import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudiencesViewComponent } from './audiences-view.component';
import { DataTableModule } from '../../../../shared/data-table/data-table.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UiSharedModule } from '@instigo-app/ui/shared';

@NgModule({
  declarations: [AudiencesViewComponent],
  imports: [CommonModule, DataTableModule, UiSharedModule, NzToolTipModule],
  exports: [AudiencesViewComponent],
})
export class AudiencesViewModule {}

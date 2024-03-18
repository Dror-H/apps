import { NgModule } from '@angular/core';
import { AudienceOverviewComponent } from './audience-overview.component';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@app/shared/data-table/data-table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [AudienceOverviewComponent],
  imports: [
    CommonModule,
    DataTableModule,
    ReactiveFormsModule,
    NzGridModule,
    NzCardModule,
    NzButtonModule,
    NzDividerModule,
  ],
  exports: [AudienceOverviewComponent],
})
export class AudienceOverviewModule {}

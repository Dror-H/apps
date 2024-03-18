import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NgBooleanPipesModule, NgObjectPipesModule } from 'ngx-pipes';
import { BreakdownDetailsTableComponent } from './breakdown-details-table.component';

@NgModule({
  declarations: [BreakdownDetailsTableComponent],
  exports: [BreakdownDetailsTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgObjectPipesModule,
    NgBooleanPipesModule,
    NzCardModule,
    NzTableModule,
    NzToolTipModule,
    NzSelectModule,
    NzSkeletonModule,
    NzEmptyModule,
    TranslateModule,
  ],
})
export class BreakdownDetailsTableModule {}
